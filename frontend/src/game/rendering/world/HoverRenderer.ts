// rendering/world/HoverRenderer.ts
import { type HoverState }  from '@/game/world/systems/HoverSystem';
import { type HoverTheme }  from './WorldTheme';
import { type Camera }      from '@/game/core/Camera';
import { type Vec2 }        from '@/game/utils/Vec2';
import { vertex }           from '@/game/utils/HexGeometry/Vertex';
import { edge }             from '@/game/utils/HexGeometry/Edge';

export class HoverRenderer {
    constructor(
        private readonly ctx:    CanvasRenderingContext2D,
        private readonly theme:  HoverTheme,
        private readonly camera: Camera,
    ) {}

    render(hover: HoverState) {
        if (!hover.target) return;

        switch (hover.target.kind) {
            case 'vertex': this.drawVertexHover(hover.target.vertex); break;
            case 'edge':   this.drawEdgeHover(hover.target.edge);     break;
            case 'hex':    this.drawHexHover(hover.target.hex);        break;
        }
    }

    // ─── Vertex hover ─────────────────────────────────────────────────

    private drawVertexHover(v: Vertex) {
        const { ctx, theme } = this;
        const pos            = this.vertexToScreen(v);

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

        const p1 = this.vertexToScreen(v1);
        const p2 = this.vertexToScreen(v2);

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
        const corners        = this.camera.hexCornersScreen(hex);

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

    private vertexToScreen(v: Vertex): Vec2 {
        const positions = v.hexes.map(h => this.camera.hexToScreen(h));
        return {
            x: positions.reduce((sum, p) => sum + p.x, 0) / 3,
            y: positions.reduce((sum, p) => sum + p.y, 0) / 3,
        };
    }
}