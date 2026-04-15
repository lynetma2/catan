import type {PlayerResponseState} from "@/game/hud/panels/tradeOffer/types.ts";
import type {PlayerResponseTheme, ResponseColors} from "@/game/rendering/hud/tradeOffer/PlayerResponseTheme.ts";

export class ResponseRenderer {
    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: PlayerResponseTheme,
    ) {}

    render(
        playerResponseStates: PlayerResponseState[],
    ): void {
        for (const state of playerResponseStates) {
            this.drawChip(state);
        }
    }

    private drawChip(state: PlayerResponseState): void {
        const { chip, response } = state;
        const colors = this.theme.responseColors[response];

        this.drawRing(chip.cx, chip.cy, chip.radius, colors);
        this.drawInitial(chip.cx, chip.cy, chip.initial, colors);
        this.drawDot(chip.dotCx, chip.dotCy, chip.dotRadius, colors);
    }

    private drawRing(
        cx: number, cy: number, radius: number,
        colors: ResponseColors
    ): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.background;
        ctx.fill();
        ctx.lineWidth = this.theme.ringWidth;
        ctx.strokeStyle = colors.ring;
        ctx.stroke();
    }

    private drawInitial(
        cx: number, cy: number,
        initial: string,
        colors: ResponseColors
    ): void {
        const ctx = this.ctx;
        ctx.font = this.theme.initialFont;
        ctx.fillStyle = colors.initial;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initial, cx, cy);
    }

    private drawDot(
        dotCx: number, dotCy: number, dotRadius: number,
        colors: ResponseColors
    ): void {
        const ctx = this.ctx;

        // Punch a transparent gap between dot and chip ring
        ctx.beginPath();
        ctx.arc(dotCx, dotCy, dotRadius + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.background;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dotCx, dotCy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        ctx.fill();
    }
}