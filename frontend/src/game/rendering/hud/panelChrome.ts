// rendering/hud/panelChrome.ts
import { type Rect }       from '@/game/utils/Rect';
import type {PanelTheme} from "@/game/rendering/theme/theme.ts";

export function drawPanelChrome(
    ctx:   CanvasRenderingContext2D,
    bounds: Rect,
    title:  string,
    theme:  PanelTheme,
) {
    const { x, y, width, height } = bounds;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, theme.borderRadius);
    ctx.fillStyle   = theme.background;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth   = theme.borderWidth;
    ctx.fill();
    ctx.stroke();

    ctx.font         = theme.titleFont;
    ctx.fillStyle    = theme.titleColor;
    ctx.textBaseline = 'top';
    ctx.fillText(title.toUpperCase(), x + theme.titlePadding, y + theme.titlePadding);
    ctx.restore();
}