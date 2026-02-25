

// ─── Types ────────────────────────────────────────────────────────────

import {type BuildTarget, BuildTargetKind} from "@/game/core/types.ts";
import type {Board} from "@/game/world/board/Board.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex} from "@/game/utils/HexGeometry/Hex.ts";
import {vertex, type Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";

export type HoverMode =
    | 'vertex'   // settlement / city placement
    | 'edge'     // road placement
    | 'hex'      // robber placement
    | 'inspect'  // no build mode — just show tile info

export interface HoverState {
    target: BuildTarget | null;
}

// ─── System ───────────────────────────────────────────────────────────

export class HoverSystem {
    private target: BuildTarget | null = null;

    constructor(
        private readonly board:  Board,
        private readonly camera: Camera,
    ) {}

    // ─── Update — called every mousemove from World ───────────────────

    update(screenPos: Vec2, mode: HoverMode) {
        switch (mode) {
            case 'vertex':  this.target = this.findVertex(screenPos);  break;
            case 'edge':    this.target = this.findEdge(screenPos);    break;
            case 'hex':     this.target = this.findHex(screenPos);     break;
            case 'inspect': this.target = this.findHex(screenPos);     break;
        }
    }

    // ─── Queries ──────────────────────────────────────────────────────

    getTarget(): BuildTarget | null {
        return this.target;
    }

    getState(): HoverState {
        return { target: this.target };
    }

    // ─── Vertex finding ───────────────────────────────────────────────

    private findVertex(screenPos: Vec2): BuildTarget | null {
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

    private findEdge(screenPos: Vec2): BuildTarget | null {
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
        const positions = v.hexes.map(h => this.camera.hexToScreen(h));
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
}