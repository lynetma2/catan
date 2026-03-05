// rendering/hud/resource/modes/TradeModeRenderer.ts
import { type Rect }                      from '@/game/utils/Rect';
import { drawModeOverlay, drawModeLabel } from '../shared/ModeOverlay';
import type {TradeModeState} from "@/game/hud/panels/resource/types.ts";

const TRADE_STYLE = {
    overlayColor: 'rgba(0, 20, 60, 0.25)',
    labelColor:   'rgba(100, 200, 255, 0.9)',
};

export class TradeModeRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    render(mode: TradeModeState, bounds: Rect) {
        drawModeOverlay(this.ctx, bounds, TRADE_STYLE);
        drawModeLabel(this.ctx, mode.label, bounds, TRADE_STYLE.labelColor);

        if (mode.canConfirm) {
            this.drawConfirmButton(bounds);
        }
    }

    private drawConfirmButton(bounds: Rect) {
        const { ctx }   = this;
        const btnWidth  = 80;
        const btnHeight = 24;
        const btnX      = bounds.x + bounds.width  / 2 - btnWidth  / 2;
        const btnY      = bounds.y + bounds.height - btnHeight - 8;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 6);
        ctx.fillStyle   = 'rgba(30, 100, 180, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle    = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Offer', btnX + btnWidth / 2, btnY + btnHeight / 2);
        ctx.restore();
    }
}