// rendering/world/hover/BuildHoverRenderer.ts
import type {HoverTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {edge, type Edge} from "@/game/utils/HexGeometry/Edge.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {BuildHoverState} from "@/game/world/systems/hover/BuildHoverSystem.ts";
import {type BuildTarget, BuildTargetKind} from "@/game/core/types.ts";

export class BuildHoverRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly theme: HoverTheme,
        private readonly camera: Camera,
    ) {
    }

    render(state: BuildHoverState) {
        state.validTargets.forEach(t => this.drawValidTarget(t));
        if (state.target) this.drawHoveredTarget(state.target);
    }

    // ─── Dispatch ─────────────────────────────────────────────────────

    private drawValidTarget(target: BuildTarget) {
        switch (target.kind) {
            case BuildTargetKind.Vertex:
                this.drawVertexValid(target.vertex);
                break;
            case BuildTargetKind.Edge:
                this.drawEdgeValid(target.edge);
                break;
            case BuildTargetKind.Hex:
                this.drawHexHover(target.hex);
                break;
        }
    }

    private drawHoveredTarget(target: BuildTarget) {
        switch (target.kind) {
            case BuildTargetKind.Vertex:
                this.drawVertexHover(target.vertex);
                break;
            case BuildTargetKind.Edge:
                this.drawEdgeHover(target.edge);
                break;
            case BuildTargetKind.Hex:
                this.drawHexHover(target.hex);
                break;
        }
    }

    // ─── Valid (dim) targets ───────────────────────────────────────────

    private drawVertexValid(v: Vertex) {
        const {ctx, theme} = this;
        const pos = this.vertexToWorld(v);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, theme.vertex.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = theme.vertex.validFillColor;
        ctx.fill();
    }

    private drawEdgeValid(e: Edge) {
        const {ctx, theme} = this;
        const [v1, v2] = edge.vertices(e);
        const p1 = this.vertexToWorld(v1);
        const p2 = this.vertexToWorld(v2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = theme.edge.validFillColor;
        ctx.lineWidth = theme.edge.width * 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // ─── Hovered targets ──────────────────────────────────────────────

    private drawVertexHover(v: Vertex) {
        const {ctx, theme} = this;
        const pos = this.vertexToWorld(v);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, theme.vertex.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.vertex.fillColor;
        ctx.fill();
        ctx.strokeStyle = theme.vertex.strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private drawEdgeHover(e: Edge) {
        const {ctx, theme} = this;
        const [v1, v2] = edge.vertices(e);
        const p1 = this.vertexToWorld(v1);
        const p2 = this.vertexToWorld(v2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = theme.edge.fillColor;
        ctx.lineWidth = theme.edge.width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    private drawHexHover(h: Hex) {
        const {ctx, theme} = this;
        const corners = this.camera.hexCornersWorld(h);

        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
        ctx.closePath();
        ctx.fillStyle = theme.hex.fillColor;
        ctx.fill();
    }

    // ─── Geometry ─────────────────────────────────────────────────────

    private vertexToWorld(v: Vertex): Vec2 {
        const positions = v.hexes.map(h => this.camera.hexToWorld(h));
        return {
            x: positions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: positions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }
}