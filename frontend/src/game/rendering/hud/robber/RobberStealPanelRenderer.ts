// rendering/hud/robberSteal/RobberStealPanelRenderer.ts


import type {RobberStealPanelState, StealTarget} from "@/game/hud/panels/robber/types.ts";

export interface RobberStealTheme {
    fillColor: string;
    fillColorHovered: string;
    strokeColor: string;
    strokeWidth: number;
    borderRadius: number;
    swatchRadius: number;
    labelFont: string;
    labelColor: string;
}

export const DEFAULT_ROBBER_STEAL_THEME: RobberStealTheme = {
    fillColor: 'rgba(20, 20, 24, 0.85)',
    fillColorHovered: 'rgba(40, 40, 48, 0.95)',
    strokeColor: 'rgba(255, 255, 255, 0.25)',
    strokeWidth: 1.5,
    borderRadius: 6,
    swatchRadius: 6,
    labelFont: 'bold 12px monospace',
    labelColor: 'rgba(255, 255, 255, 0.9)',
};

export class RobberStealPanelRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly theme: RobberStealTheme = DEFAULT_ROBBER_STEAL_THEME,
    ) {
    }

    render(state: RobberStealPanelState) {
        if (!state.targets || state.targets.length === 0) return;

        state.targets.forEach(target => this.drawTarget(target));
    }

    // ─── Target button ────────────────────────────────────────────────

    private drawTarget(target: StealTarget) {
        const {ctx, theme} = this;
        const {x, y, width, height} = target.bounds;

        ctx.save();

        // ── Background ──
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.borderRadius);
        ctx.fillStyle = target.isHovered ? theme.fillColorHovered : theme.fillColor;
        ctx.fill();

        // ── Stroke ──
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.borderRadius);
        ctx.strokeStyle = theme.strokeColor;
        ctx.lineWidth = theme.strokeWidth;
        ctx.stroke();

        // ── Player color swatch ──
        this.drawSwatch(target);

        // ── Label ──
        this.drawLabel(target);

        ctx.restore();
    }

    private drawSwatch(target: StealTarget) {
        const {ctx, theme} = this;
        const {x, y, height} = target.bounds;
        const cx = x + theme.swatchRadius + 10;
        const cy = y + height / 2;

        ctx.beginPath();
        ctx.arc(cx, cy, theme.swatchRadius, 0, Math.PI * 2);
        ctx.fillStyle = target.playerColor;
        ctx.fill();
    }

    private drawLabel(target: StealTarget) {
        const {ctx, theme} = this;
        const {x, y, height} = target.bounds;
        const labelX = x + theme.swatchRadius * 2 + 18;

        ctx.font = theme.labelFont;
        ctx.fillStyle = theme.labelColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(target.playerName, labelX, y + height / 2);
    }
}