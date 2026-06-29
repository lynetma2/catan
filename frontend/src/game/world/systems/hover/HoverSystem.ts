

// ─── Types ────────────────────────────────────────────────────────────

import {type BuildTarget, BuildTargetKind, PieceType} from "@/game/core/types.ts";
import type {Board} from "@/game/world/board/Board.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex} from "@/game/utils/HexGeometry/Hex.ts";
import {vertex, type Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {BuildValidator} from "@/game/world/systems/build/BuildValidator.ts";
import type {SharedState} from "@/game/core/SharedState.ts";

export type HoverMode = BuildTargetKind | 'inspect' | "robber";

export interface HoverState {
    target: BuildTarget | null;
    validTargets: BuildTarget[] | null;
    mode: HoverMode | null;
}

// ─── System ───────────────────────────────────────────────────────────

export class HoverSystem {
    private target: BuildTarget | null = null;
    private validTargets: BuildTarget[] = [];
    private currentMode: HoverMode;
    private validSet: Set<string> = new Set();

    constructor(
        private readonly board:  Board,
        private readonly camera: Camera,
        private readonly buildValidator: BuildValidator,
        private readonly shared: SharedState,
    ) {}

    //Added for performance.
    onModeChanged() {
        const buildMode = this.shared.buildMode;
        const playerId  = this.shared.localPlayerId;

        console.log('[HoverSystem] onModeChanged', { buildMode, playerId });

        // ─── Robber mode ──────────────────────────────────────────────
        if (buildMode === "robber") {
            const robberHexes = this.board.getValidRobberHexes();
            this.validTargets = robberHexes.map(h => ({kind: BuildTargetKind.Hex, hex: h}));
            this.validSet = new Set(this.validTargets.map(t => this.targetKey(t)));
            return;
        }

        // ─── Build modes ──────────────────────────────────────────────
        if (!buildMode || !playerId) {
            this.validTargets = [];
            this.validSet.clear();
            return;
        }

        this.validTargets = this.buildValidator.validTargets(buildMode, playerId);
        console.log('[HoverSystem] validTargets count:', this.validTargets.length);
        this.validSet     = new Set(this.validTargets.map(t => this.targetKey(t)));
    }

    // ─── Update — called every mousemove from World ───────────────────

    update(screenPos: Vec2, mode: HoverMode) {
        this.currentMode = mode;
        if (mode === 'inspect') {
            this.target = this.findClosestFeature(screenPos);
        } else {
            const candidate = this.findCandidate(screenPos, mode);
            // For build/robber, only accept if it's in the valid set
            this.target = (candidate && this.validSet.has(this.targetKey(candidate)))
                ? candidate
                : null;
        }
    }

    // ─── Queries ──────────────────────────────────────────────────────

    getTarget(): BuildTarget | null {
        return this.target;
    }

    getState(): HoverState {
        return {
            target: this.target,
            validTargets: this.validTargets,
            mode: this.currentMode,
        };
    }

    clear() {
        this.target = null;
    }

    private findClosestFeature(screenPos: Vec2): BuildTarget | null {
        const worldPos      = this.camera.toWorld(screenPos);
        const closestVertex = this.findVertex(screenPos);
        const closestEdge   = this.findEdge(screenPos);

        // Filter to only valid targets
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

        // Check if target is valid for any piece type
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

    // ─── Vertex finding ───────────────────────────────────────────────

    private findVertex(screenPos: Vec2): Extract<BuildTarget, { kind: BuildTargetKind.Vertex }> | null {
        const worldPos    = this.camera.toWorld(screenPos);
        const centerHex   = this.camera.screenToHex(screenPos);

        // A vertex is shared by 3 hexes — check center hex and all neighbours
        // to find which vertex the mouse is closest to
        const candidateHexes = [
            centerHex,
            ...hex.directions.map((_, dir) => hex.neighbor(centerHex, dir))
        ];

        let closestVertex:   Vertex | null = null;
        let closestDistance: number        = Infinity;

        candidateHexes.forEach(h => {
            if (!this.board.hexGrid.isValidHex(h)) return;

            vertex.ofHex(h).forEach(v => {
                // Only consider vertices on the valid board
                if (!this.board.hexGrid.isValidVertex(v)) return;

                const vPos     = this.vertexToWorld(v);
                const distance = Math.hypot(worldPos.x - vPos.x, worldPos.y - vPos.y);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestVertex   = v;
                }
            });
        });

        // Snap threshold — only highlight if mouse is within range
        const snapThreshold = this.camera.hexToScreen(centerHex) !== null
            ? this.snapThreshold()
            : Infinity;

        if (closestVertex && closestDistance <= snapThreshold) {
            return { kind: BuildTargetKind.Vertex, vertex: closestVertex };
        }

        return null;
    }

    // ─── Edge finding ─────────────────────────────────────────────────

    private findEdge(screenPos: Vec2): Extract<BuildTarget, { kind: BuildTargetKind.Edge }> | null {
        const worldPos  = this.camera.toWorld(screenPos);
        const centerHex = this.camera.screenToHex(screenPos);

        // An edge is shared by 2 hexes — check center hex and neighbours
        const candidateHexes = [
            centerHex,
            ...hex.directions.map((_, dir) => hex.neighbor(centerHex, dir))
        ];

        let closestEdge:     Edge | null = null;
        let closestDistance: number      = Infinity;

        candidateHexes.forEach(h => {
            if (!this.board.hexGrid.isValidHex(h)) return;

            edge.ofHex(h).forEach(e => {
                if (!this.board.hexGrid.isValidEdge(e)) return;

                const midpoint = this.edgeMidpoint(e);
                const distance = Math.hypot(worldPos.x - midpoint.x, worldPos.y - midpoint.y);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEdge     = e;
                }
            });
        });

        if (closestEdge && closestDistance <= this.snapThreshold()) {
            return { kind: BuildTargetKind.Edge, edge: closestEdge };
        }

        return null;
    }

    // ─── Hex finding ──────────────────────────────────────────────────

    private findHex(screenPos: Vec2): BuildTarget | null {
        const h = this.camera.screenToHex(screenPos);

        if (this.board.hexGrid.isValidHex(h)) {
            return { kind: BuildTargetKind.Hex, hex: h };
        }

        return null;
    }

    // ─── Geometry helpers ─────────────────────────────────────────────

    // Average of the 3 hex centers that share this vertex
    private vertexToWorld(v: Vertex): Vec2 {
        const positions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: positions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: positions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }

    // Average of the 2 vertex endpoints of this edge
    private edgeMidpoint(e: Edge): Vec2 {
        const [v1, v2] = edge.vertices(e);
        const p1       = this.vertexToWorld(v1);
        const p2       = this.vertexToWorld(v2);
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        };
    }

    // Snap threshold scales with zoom — tighter when zoomed out
    private snapThreshold(): number {
        return 28 / this.camera.getZoom();
    }

    private findCandidate(screenPos: Vec2, mode: HoverMode): BuildTarget | null {
        switch (mode) {
            case BuildTargetKind.Vertex: return this.findVertex(screenPos);
            case BuildTargetKind.Edge:   return this.findEdge(screenPos);
            case BuildTargetKind.Hex:
            case 'inspect':
            case 'robber':              return this.findHex(screenPos);
        }
    }

    private targetKey(target: BuildTarget): string {
        switch (target.kind) {
            case BuildTargetKind.Vertex: return vertex.toKey(target.vertex);
            case BuildTargetKind.Edge:   return edge.toKey(target.edge);
            case BuildTargetKind.Hex:    return hex.toKey(target.hex);
        }
    }
}