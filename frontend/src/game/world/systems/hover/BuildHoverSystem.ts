// world/systems/hover/BuildHoverSystem.ts
import {type BuildTarget, BuildTargetKind, PieceType} from "@/game/core/types.ts";
import type {Board} from "@/game/world/board/Board.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex} from "@/game/utils/HexGeometry/Hex.ts";
import {vertex, type Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {BuildValidator} from "@/game/world/systems/build/BuildValidator.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameUiEvents} from "@/events/game/GameUiEvents.ts";

export type BuildHoverMode = BuildTargetKind | 'inspect';

export interface BuildHoverState {
    target: BuildTarget | null;
    validTargets: BuildTarget[];
    mode: BuildHoverMode | null;
}

export class BuildHoverSystem {
    private target: BuildTarget | null = null;
    private validTargets: BuildTarget[] = [];
    private currentMode: BuildHoverMode = 'inspect';
    private validSet: Set<string> = new Set();
    private lastScreenPos: Vec2 | null = null;

    constructor(
        private readonly board: Board,
        private readonly camera: Camera,
        private readonly buildValidator: BuildValidator,
        private readonly shared: SharedState,
        bus: EventBus<GameEventMap>,
    ) {
        // Build hover owns its own subscriptions — World doesn't need to forward these.
        // build.enter: new piece type selected → recompute valid targets for that piece
        // build.exit:  selection cleared      → clear valid targets and hover state
        bus.on(GameUiEvents.build.enter, () => this.onModeChanged());
        bus.on(GameUiEvents.build.exit, () => this.clear());
    }

    // ─── Mode change ──────────────────────────────────────────────────
    // Recomputes the valid-target set for the current buildMode.
    // buildMode is now purely PieceType | null — no "robber" case here.

    onModeChanged() {
        const buildMode = this.shared.buildMode;
        const playerId  = this.shared.localPlayerId;

        if (!buildMode || !playerId) {
            this.validTargets = [];
            this.validSet.clear();
        } else {
            this.validTargets = this.buildValidator.validTargets(buildMode, playerId);
            this.validSet = new Set(this.validTargets.map(t => this.targetKey(t)));
        }

        if (this.lastScreenPos) {
            this.update(this.lastScreenPos, this.currentMode);
        }
    }

    // ─── Per-mousemove update ─────────────────────────────────────────

    update(screenPos: Vec2, mode: BuildHoverMode) {
        this.lastScreenPos = screenPos;
        this.currentMode = mode;

        if (mode === 'inspect') {
            this.target = this.findClosestFeature(screenPos);
        } else {
            const candidate = this.findCandidate(screenPos, mode);
            this.target = (candidate && this.validSet.has(this.targetKey(candidate)))
                ? candidate
                : null;
        }
    }

    // ─── Queries ──────────────────────────────────────────────────────

    getTarget(): BuildTarget | null {
        return this.target;
    }

    getState(): BuildHoverState {
        return {
            target: this.target,
            validTargets: this.validTargets,
            mode: this.currentMode,
        };
    }

    clearHover() {
        this.target = null;
        this.lastScreenPos = null;
    }

    clear() {
        this.validTargets = [];
        this.validSet.clear();
        this.clearHover();
    }

    // ─── Feature finding ──────────────────────────────────────────────

    private findClosestFeature(screenPos: Vec2): BuildTarget | null {
        const worldPos      = this.camera.toWorld(screenPos);
        const closestVertex = this.findVertex(screenPos);
        const closestEdge   = this.findEdge(screenPos);

        const validVertex = closestVertex && this.isValidInspectTarget(closestVertex) ? closestVertex : null;
        const validEdge   = closestEdge   && this.isValidInspectTarget(closestEdge)   ? closestEdge   : null;

        if (!validVertex && !validEdge) return this.findHex(screenPos);
        if (!validVertex)               return validEdge;
        if (!validEdge)                 return validVertex;

        const vertexPos  = this.vertexToWorld(validVertex.vertex);
        const edgePos    = this.edgeMidpoint(validEdge.edge);
        const vertexDist = Math.hypot(worldPos.x - vertexPos.x, worldPos.y - vertexPos.y);
        const edgeDist   = Math.hypot(worldPos.x - edgePos.x,   worldPos.y - edgePos.y);

        return vertexDist <= edgeDist ? validVertex : validEdge;
    }

    private isValidInspectTarget(target: BuildTarget): boolean {
        const playerId = this.shared.localPlayerId;
        if (!playerId) return false;

        switch (target.kind) {
            case BuildTargetKind.Vertex:
                return this.buildValidator.canBuild(PieceType.Settlement, target, playerId)
                    || this.buildValidator.canBuild(PieceType.City,       target, playerId);
            case BuildTargetKind.Edge:
                return this.buildValidator.canBuild(PieceType.Road, target, playerId);
            default:
                return false;
        }
    }

    private findVertex(screenPos: Vec2): Extract<BuildTarget, { kind: BuildTargetKind.Vertex }> | null {
        const worldPos = this.camera.toWorld(screenPos);
        const centerHex = this.camera.screenToHex(screenPos);
        const candidateHexes = [
            centerHex,
            ...hex.directions.map((_, dir) => hex.neighbor(centerHex, dir)),
        ];

        let closestVertex:   Vertex | null = null;
        let closestDistance: number        = Infinity;

        for (const h of candidateHexes) {
            if (!this.board.hexGrid.isValidHex(h)) continue;
            for (const v of vertex.ofHex(h)) {
                if (!this.board.hexGrid.isValidVertex(v)) continue;
                const vPos     = this.vertexToWorld(v);
                const distance = Math.hypot(worldPos.x - vPos.x, worldPos.y - vPos.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestVertex   = v;
                }
            }
        }

        const snapThreshold = this.camera.hexToScreen(centerHex) !== null
            ? this.snapThreshold()
            : Infinity;

        return (closestVertex && closestDistance <= snapThreshold)
            ? {kind: BuildTargetKind.Vertex, vertex: closestVertex}
            : null;
    }

    private findEdge(screenPos: Vec2): Extract<BuildTarget, { kind: BuildTargetKind.Edge }> | null {
        const worldPos = this.camera.toWorld(screenPos);
        const centerHex = this.camera.screenToHex(screenPos);
        const candidateHexes = [
            centerHex,
            ...hex.directions.map((_, dir) => hex.neighbor(centerHex, dir)),
        ];

        let closestEdge:     Edge | null = null;
        let closestDistance: number      = Infinity;

        for (const h of candidateHexes) {
            if (!this.board.hexGrid.isValidHex(h)) continue;
            for (const e of edge.ofHex(h)) {
                if (!this.board.hexGrid.isValidEdge(e)) continue;
                const midpoint = this.edgeMidpoint(e);
                const distance = Math.hypot(worldPos.x - midpoint.x, worldPos.y - midpoint.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEdge     = e;
                }
            }
        }

        return (closestEdge && closestDistance <= this.snapThreshold())
            ? {kind: BuildTargetKind.Edge, edge: closestEdge}
            : null;
    }

    private findHex(screenPos: Vec2): BuildTarget | null {
        const h = this.camera.screenToHex(screenPos);
        return this.board.hexGrid.isValidHex(h)
            ? {kind: BuildTargetKind.Hex, hex: h}
            : null;
    }

    private findCandidate(screenPos: Vec2, mode: BuildHoverMode): BuildTarget | null {
        switch (mode) {
            case BuildTargetKind.Vertex:
                return this.findVertex(screenPos);
            case BuildTargetKind.Edge:
                return this.findEdge(screenPos);
            case BuildTargetKind.Hex:
                return this.findHex(screenPos);
            case 'inspect':
                return this.findClosestFeature(screenPos);
        }
    }

    // ─── Geometry helpers ─────────────────────────────────────────────

    vertexToWorld(v: Vertex): Vec2 {
        const positions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: positions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: positions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }

    edgeMidpoint(e: Edge): Vec2 {
        const [v1, v2] = edge.vertices(e);
        const p1       = this.vertexToWorld(v1);
        const p2       = this.vertexToWorld(v2);
        return {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
    }

    private snapThreshold(): number {
        return 28 / this.camera.getZoom();
    }

    private targetKey(target: BuildTarget): string {
        switch (target.kind) {
            case BuildTargetKind.Vertex: return vertex.toKey(target.vertex);
            case BuildTargetKind.Edge:   return edge.toKey(target.edge);
            case BuildTargetKind.Hex:    return hex.toKey(target.hex);
        }
    }
}