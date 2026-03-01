import type {HoverTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {HoverState} from "@/game/world/systems/hover/HoverSystem.ts";
import {type BuildTarget, BuildTargetKind} from "@/game/core/types.ts";

export class HoverRenderer {
    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly theme:  HoverTheme,
        private readonly camera: Camera,
    ) {}

    render(hover: HoverState) {
        // First pass — draw all valid spots dimly
        hover.validTargets!.forEach(target => {
            this.drawValidTarget(target);
        });

        // Second pass — draw hovered spot brightly on top
        if (hover.target) {
            this.drawHoveredTarget(hover.target);
        }
    }

    private drawValidTarget(target: BuildTarget) {
        switch (target.kind) {
            case BuildTargetKind.Vertex: this.drawVertexValid(target.vertex); break;
            case BuildTargetKind.Edge:   this.drawEdgeValid(target.edge);     break;
            case BuildTargetKind.Hex:    this.drawHexHover(target.hex);       break;
        }
    }

    private drawHoveredTarget(target: BuildTarget) {
        switch (target.kind) {
            case BuildTargetKind.Vertex: this.drawVertexHover(target.vertex); break;
            case BuildTargetKind.Edge:   this.drawEdgeHover(target.edge);     break;
            case BuildTargetKind.Hex:    this.drawHexHover(target.hex);       break;
        }
    }

    // Dim version — all valid spots
    private drawVertexValid(v: Vertex) {
        const { ctx, theme } = this;
        const pos            = this.vertexToWorld(v);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, theme.vertex.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle   = theme.vertex.validFillColor;    // ← add to theme
        ctx.fill();
    }

    private drawEdgeValid(e: Edge) {
        const { ctx, theme } = this;
        const [v1, v2]       = edge.vertices(e);
        const p1             = this.vertexToWorld(v1);
        const p2             = this.vertexToWorld(v2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = theme.edge.validFillColor;      // ← add to theme
        ctx.lineWidth   = theme.edge.width * 0.6;
        ctx.lineCap     = 'round';
        ctx.stroke();
    }

    // ─── Vertex hover ─────────────────────────────────────────────────

    private drawVertexHover(v: Vertex) {
        const { ctx, theme } = this;
        const pos            = this.vertexToWorld(v);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, theme.vertex.radius, 0, Math.PI * 2);
        ctx.fillStyle   = theme.vertex.fillColor;
        ctx.fill();
        ctx.strokeStyle = theme.vertex.strokeColor;
        ctx.lineWidth   = 2;
        ctx.stroke();
    }

    // ─── Edge hover ───────────────────────────────────────────────────

    private drawEdgeHover(e: Edge) {
        const { ctx, theme } = this;
        const [v1, v2]       = edge.vertices(e);

        const p1 = this.vertexToWorld(v1);
        const p2 = this.vertexToWorld(v2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = theme.edge.fillColor;
        ctx.lineWidth   = theme.edge.width;
        ctx.lineCap     = 'round';
        ctx.stroke();
    }

    // ─── Hex hover ────────────────────────────────────────────────────

    private drawHexHover(hex: Hex) {
        const { ctx, theme } = this;
        const corners        = this.camera.hexCornersWorld(hex);

        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = theme.hex.fillColor;
        ctx.fill();
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private vertexToWorld(v: Vertex): Vec2 {
        const positions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: positions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: positions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }
}