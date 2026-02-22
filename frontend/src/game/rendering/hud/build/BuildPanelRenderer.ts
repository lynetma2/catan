// rendering/hud/BuildPanelRenderer.ts
import {type ButtonTheme, DEFAULT_HUD_THEME, DEFAULT_THEME} from "@/game/rendering/theme/theme.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import type {BuildPanelState, Button} from "@/game/hud/panels/build/types.ts";
import {BUTTON_STYLES, type ButtonStyle} from "@/game/rendering/theme/ButtonTheme.ts";

export class BuildPanelRenderer {
    private readonly imageCache = new Map<string, HTMLImageElement>();

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: ButtonTheme = DEFAULT_THEME,
    ) {}

    render(state: BuildPanelState) {
        drawPanelChrome(this.ctx, state.bounds, "Build", DEFAULT_HUD_THEME.panel);
        state.buttons.forEach(button => this.drawButton(button));
    }

    // ─── Button ───────────────────────────────────────────────────────

    private drawButton(button: Button) {
        const style        = BUTTON_STYLES[button.type];
        const { ctx, theme } = this;
        const { x, y, width, height } = button.bounds;

        ctx.save();

        // ── Background fill ──
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
        ctx.fillStyle = style.fillColor;
        ctx.fill();

        // ── State overlay ──
        // Composited on top of fill so the base color still shows through
        const overlay = this.resolveOverlay(button);
        if (overlay) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
            ctx.fillStyle = overlay;
            ctx.fill();
        }

        // ── Stroke ──
        // Per-button override wins, otherwise state-driven, then theme default
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
        ctx.strokeStyle = this.resolveStroke(button, style);
        ctx.lineWidth   = theme.defaults.strokeWidth;
        ctx.stroke();

        // ── Icon ──
        this.drawIcon(button, style);

        // ── Label ──
        this.drawLabel(button, style);

        // ── Disabled opacity applied last ──
        if (button.isDisabled) {
            ctx.globalAlpha = theme.defaults.disabledOpacity;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
            ctx.fillStyle = 'transparent';
            ctx.fill();
        }

        ctx.restore();
    }

    // ─── Resolution helpers ───────────────────────────────────────────

    private resolveOverlay(button: Button): string | null {
        const { states } = this.theme;
        if (button.isSelected) return states.selected.fillOverlay;
        if (button.isHovered)  return states.hovered.fillOverlay;
        if (button.isDisabled) return states.disabled.fillOverlay;
        return null;
    }

    private resolveStroke(button: Button, style: ButtonStyle): string {
        // Priority: per-button override → state-driven → theme default
        if (style.strokeColor)        return style.strokeColor;
        if (button.isSelected)        return this.theme.states.selected.strokeColor;
        if (button.isHovered)         return this.theme.states.hovered.strokeColor;
        return this.theme.defaults.strokeColor;
    }

    // ─── Icon ─────────────────────────────────────────────────────────

    private drawIcon(button: Button, style: ButtonStyle) {
        const image = this.getImage(style.imageSrc);
        if (!image.complete) return;

        const { x, y, width, height } = button.bounds;
        const scale      = style.iconScale ?? 0.5;
        const iconSize   = Math.min(width, height) * scale;
        const offsetY    = style.iconHeightOffset ?? 0;
        const iconX      = x + (width  - iconSize) / 2;
        const iconY      = y + (height - iconSize) / 2 + offsetY;

        this.ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
    }

    private getImage(src: string): HTMLImageElement {
        if (!this.imageCache.has(src)) {
            const img   = new Image();
            img.src     = src;
            this.imageCache.set(src, img);
        }
        return this.imageCache.get(src)!;
    }

    // ─── Label ────────────────────────────────────────────────────────

    private drawLabel(button: Button, style: ButtonStyle) {
        const { ctx }          = this;
        const { x, y, width, height } = button.bounds;

        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle    = button.isDisabled
            ? 'rgba(255,255,255,0.4)'
            : 'rgba(255,255,255,0.9)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(style.label, x + width / 2, y + height - 6);
    }
}