import {
    type ChipLayout,
    type PlayerResponseState,
    TradeOfferResponseKind,
} from "@/game/hud/panels/tradeOffer/types.ts";
import type {PlayerResponseTheme, ResponseColors} from "@/game/rendering/hud/tradeOffer/PlayerResponseTheme.ts";

export class ResponseRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly theme: PlayerResponseTheme,
    ) {}

    render(
        playerResponseStates: PlayerResponseState[],
        isOutgoing: boolean = false,
        hoveredPlayerId: string | null = null
    ): void {
        for (const state of playerResponseStates) {
            this.drawChip(state, isOutgoing, hoveredPlayerId === state.playerId);
        }
    }

    private drawChip(state: PlayerResponseState, isOutgoing: boolean, isHovered: boolean): void {
        const {chip, response} = state;
        const responseColors = this.theme.responseColors[response];
        const isClickable = isOutgoing && response === TradeOfferResponseKind.Accept;
        const ctx = this.ctx;

        ctx.save();

        // Glow for clickable accepted chips, in the player's color
        if (isClickable) {
            ctx.shadowColor = chip.color;
            ctx.shadowBlur = isHovered ? 12 : 6;
        }

        this.drawRing(chip, isHovered && isClickable);
        ctx.shadowBlur = 0; // Reset shadow for inner elements
        this.drawInitial(chip);
        this.drawDot(chip, responseColors);

        ctx.restore();
    }

    // Ring + fill = the PLAYER (same colors as the overview panel)
    private drawRing(chip: ChipLayout, isHovered: boolean): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(chip.cx, chip.cy, chip.radius, 0, Math.PI * 2);
        ctx.fillStyle = chip.background;
        ctx.fill();
        ctx.lineWidth = isHovered ? this.theme.ringWidth + 1.5 : this.theme.ringWidth;
        ctx.strokeStyle = chip.color;
        ctx.stroke();
    }

    // Letter = lightened player color on darkened player color → readable
    private drawInitial(chip: ChipLayout): void {
        const ctx = this.ctx;
        ctx.font = this.theme.initialFont;
        ctx.fillStyle = chip.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(chip.initial, chip.cx, chip.cy);
    }

    // Dot = the RESPONSE (accept / decline / no answer)
    private drawDot(chip: ChipLayout, colors: ResponseColors): void {
        const ctx = this.ctx;
        // Punch a gap between dot and chip ring that matches the chip fill
        ctx.beginPath();
        ctx.arc(chip.dotCx, chip.dotCy, chip.dotRadius + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = chip.background;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(chip.dotCx, chip.dotCy, chip.dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        ctx.fill();
    }
}