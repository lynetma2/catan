import type {Tile} from "@/game/core/types.ts";
import type {TileTheme} from "@/game/rendering/world/WorldTheme.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";

export class TileRenderer {
    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: TileTheme,
        private readonly camera: Camera,
    ) {}

    render(tile: Tile) {
        const corners = this.camera.hexCornersScreen(tile.hex);

        this.drawFill(tile, corners);
        this.drawStroke(corners);

        if (tile.kind === 'land') {
            this.drawToken(tile.number, tile.hex, tile.hasRobber);
        }

        if (tile.hasRobber) {
            this.drawRobber(corners);
        }
    }

    // ─── Fill ─────────────────────────────────────────────────────────

    private drawFill(tile: Tile, corners: Vec2[]) {
        const { ctx, theme } = this;

        ctx.beginPath();
        this.tracePath(corners);
        ctx.fillStyle = theme.colors[tile.type];
        ctx.fill();
    }

    // ─── Stroke ───────────────────────────────────────────────────────

    private drawStroke(corners: Vec2[]) {
        const { ctx, theme } = this;

        ctx.beginPath();
        this.tracePath(corners);
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth   = theme.strokeWidth;
        ctx.stroke();
    }

    // ─── Number token ─────────────────────────────────────────────────

    private drawToken(number: number, hex: Hex, hasRobber: boolean) {
        if (hasRobber) return;   // robber covers token

        const { ctx, theme } = this;
        const center         = this.camera.hexToScreen(hex);
        const isRed          = number === 6 || number === 8;
        const dotCount       = this.dotCount(number);

        // Token background circle
        ctx.beginPath();
        ctx.arc(center.x, center.y, theme.token.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.token.background;
        ctx.fill();

        // Number text
        ctx.font         = theme.token.font;
        ctx.fillStyle    = isRed ? theme.token.textColorRed : theme.token.textColor;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(number), center.x, center.y - 4);

        // Probability dots below number
        const dotColor  = isRed ? theme.token.dotColorRed : theme.token.dotColor;
        const dotRadius = 2;
        const dotSpacing = 5;
        const totalWidth = (dotCount - 1) * dotSpacing;
        const startX     = center.x - totalWidth / 2;
        const dotY       = center.y + 6;

        for (let i = 0; i < dotCount; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        }
    }

    // ─── Robber ───────────────────────────────────────────────────────

    private drawRobber(corners: Vec2[]) {
        const { ctx, theme } = this;
        const center = {
            x: corners.reduce((sum, c) => sum + c.x, 0) / corners.length,
            y: corners.reduce((sum, c) => sum + c.y, 0) / corners.length,
        };

        ctx.beginPath();
        ctx.arc(center.x, center.y, theme.robber.radius, 0, Math.PI * 2);
        ctx.fillStyle   = theme.robber.fillColor;
        ctx.fill();
        ctx.strokeStyle = theme.robber.strokeColor;
        ctx.lineWidth   = 2;
        ctx.stroke();
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private tracePath(corners: Vec2[]) {
        const { ctx } = this;
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            ctx.lineTo(corners[i].x, corners[i].y);
        }
        ctx.closePath();
    }

    private dotCount(number: number): number {
        // Probability dots: 2→1, 3→2, 4→3, 5→4, 6→5, 8→5, 9→4, 10→3, 11→2, 12→1
        return 6 - Math.abs(7 - number);
    }
}