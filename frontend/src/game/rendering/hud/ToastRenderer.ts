// rendering/hud/ToastRenderer.ts
import { type Resolution } from '@/game/core/ResolutionManager';
import type {ToastTheme} from "@/game/rendering/theme/theme.ts";
import type {Toast} from "@/game/hud/types.ts";

export class ToastRenderer {
    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: ToastTheme,
    ) {}

    render(toast: Toast, resolution: Resolution) {
        const { ctx, theme } = this;
        const alpha  = this.resolveAlpha(toast);
        const colors = this.resolveColors(toast.kind, alpha);

        const x = resolution.cssWidth  / 2 - theme.width  / 2;
        const y = resolution.cssHeight - theme.bottomOffset;

        ctx.save();

        // Background
        ctx.beginPath();
        ctx.roundRect(x, y, theme.width, theme.height, theme.borderRadius);
        ctx.fillStyle = colors.background;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.roundRect(x, y, theme.width, theme.height, theme.borderRadius);
        ctx.strokeStyle = colors.border;
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Text
        ctx.font         = theme.font;
        ctx.fillStyle    = colors.text;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toast.message, x + theme.width / 2, y + theme.height / 2);

        ctx.restore();
    }

    private resolveAlpha(toast: Toast): number {
        // Fade in over first 150ms, fade out over last fadeMs
        const fadeIn  = Math.min(1, (2500 - toast.remainingMs) / 150);
        const fadeOut = Math.min(1, toast.remainingMs / this.theme.fadeMs);
        return Math.min(fadeIn, fadeOut);
    }

    private resolveColors(kind: Toast['kind'], alpha: number) {
        const raw = this.theme.colors[kind];
        return {
            background: raw.background.replace('$a', String(alpha * 0.92)),
            border:     raw.border.replace('$a',     String(alpha)),
            text:       raw.text,  // text fades via globalAlpha instead
        };
    }
}