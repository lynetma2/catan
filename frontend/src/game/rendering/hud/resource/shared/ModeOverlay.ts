// rendering/hud/resource/shared/ModeOverlay.ts
import { type Rect } from '@/game/utils/Rect';

export interface ModeOverlayStyle {
    overlayColor: string;
    labelColor:   string;
}

export function drawModeOverlay(
    ctx:    CanvasRenderingContext2D,
    bounds: Rect,
    style:  ModeOverlayStyle,
) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 10);
    ctx.fillStyle = style.overlayColor;
    ctx.fill();
    ctx.restore();
}

export function drawModeLabel(
    ctx:    CanvasRenderingContext2D,
    text:   string,
    bounds: Rect,
    color:  string,
) {
    ctx.save();
    ctx.font         = 'bold 11px monospace';
    ctx.fillStyle    = color;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(text, bounds.x + bounds.width / 2, bounds.y + 6);
    ctx.restore();
}