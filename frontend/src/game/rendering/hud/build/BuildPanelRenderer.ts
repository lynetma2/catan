// rendering/hud/build/BuildPanelRenderer.ts
import {type ButtonTheme, DEFAULT_THEME, type PanelTheme} from "@/game/rendering/theme/theme.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import type {BuildPanelState, Button} from "@/game/hud/panels/build/types.ts";
import {BUTTON_STYLES, type ButtonStyle} from "@/game/rendering/theme/ButtonTheme.ts";

// Same warm chrome as the resource panel so the bottom bar feels unified
const BUILD_PANEL_THEME: PanelTheme = {
    background: 'rgba(28, 18, 10, 0.85)',
    borderColor: 'rgba(255, 200, 100, 0.12)',
    borderWidth: 1,
    borderRadius: 10,
    titleFont: 'bold 11px monospace',
    titleColor: 'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

export class BuildPanelRenderer {
    private readonly imageCache = new Map<string, HTMLImageElement>();
    private readonly tintCache = new Map<string, HTMLCanvasElement>();

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: ButtonTheme = DEFAULT_THEME,
    ) {}

    render(state: BuildPanelState) {
        const chrome: PanelTheme = {
            ...BUILD_PANEL_THEME,
            borderColor: withAlpha(state.playerColor, state.isMyTurn ? 0.55 : 0.30),
        };
        drawPanelChrome(this.ctx, state.bounds, "Build", chrome);
        state.buttons.forEach(button => this.drawButton(button, state));
    }

    // ─── Button ──────────────────────────────────────────────────
    private drawButton(button: Button, state: BuildPanelState) {
        const style        = BUTTON_STYLES[button.type];
        const { ctx, theme } = this;
        const { x, y, width, height } = button.bounds;
        const enabled = !button.isDisabled;

        // Contrast-aware content color derived from the player color
        const contentColor = luminance(state.playerColor) <= 0.55 ? '#ffffff' : '#1a1a1a';
        const mutedColor = withAlpha(contentColor, 0.5);

        ctx.save();

        // ── Background fill — ALWAYS the player's color; faded when disabled ──
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
        ctx.fillStyle = enabled ? state.playerColor : withAlpha(state.playerColor, 0.30);
        ctx.fill();

        // ── State overlay (hover / selected) — active buttons only ──
        const overlay = this.resolveOverlay(button);
        if (overlay) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
            ctx.fillStyle = overlay;
            ctx.fill();
        }

        // ── Stroke — darker rim of the player color, faded when disabled ──
        if (button.isSelected && enabled) {
            ctx.shadowColor = state.playerColor;
            ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, theme.defaults.borderRadius);
        ctx.strokeStyle = enabled ? shade(state.playerColor, 0.6) : withAlpha(state.playerColor, 0.45);
        ctx.lineWidth = enabled ? 2 : 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ── Icon — tinted for contrast, muted when disabled ──
        this.drawIcon(button, style, enabled ? contentColor : mutedColor);

        // ── Label ──
        this.drawLabel(button, style, enabled ? contentColor : mutedColor);

        ctx.restore();
    }

    // ─── Resolution helpers ───────────────────────────────────────
    private resolveOverlay(button: Button): string | null {
        // Disabled state is conveyed by the faded fill — no grey overlay anymore
        if (button.isDisabled) return null;
        const { states } = this.theme;
        if (button.isSelected) return states.selected.fillOverlay;
        if (button.isHovered)  return states.hovered.fillOverlay;
        return null;
    }

    // ─── Icon ─────────────────────────────────────────────────────
    private drawIcon(button: Button, style: ButtonStyle, tint: string) {
        const tinted = this.getTintedIcon(style.imageSrc, tint);
        const image = tinted ?? this.getImage(style.imageSrc);
        if (!this.isReady(image)) return;

        const { x, y, width, height } = button.bounds;
        const scale = style.iconScale ?? 0.5;
        const iconSize = Math.min(width, height) * scale;
        const offsetY = style.iconHeightOffset ?? 0;
        this.ctx.drawImage(
            image,
            x + (width - iconSize) / 2,
            y + (height - iconSize) / 2 + offsetY,
            iconSize,
            iconSize,
        );
    }

    private isReady(source: HTMLImageElement | HTMLCanvasElement): boolean {
        return source instanceof HTMLCanvasElement
            || (source.complete && source.naturalWidth > 0);
    }

    /** Tints a button icon to a color; cached per (asset, color). */
    private getTintedIcon(src: string, color: string): HTMLCanvasElement | null {
        const key = `${src}_${color}`;
        const cached = this.tintCache.get(key);
        if (cached) return cached;

        const img = this.getImage(src);
        if (!img.complete || img.naturalWidth === 0) return null;

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const wctx = canvas.getContext('2d')!;
        wctx.drawImage(img, 0, 0);
        wctx.globalCompositeOperation = 'source-in';
        wctx.fillStyle = color;
        wctx.fillRect(0, 0, canvas.width, canvas.height);

        this.tintCache.set(key, canvas);
        return canvas;
    }

    private getImage(src: string): HTMLImageElement {
        if (!this.imageCache.has(src)) {
            const img   = new Image();
            img.src     = src;
            this.imageCache.set(src, img);
        }
        return this.imageCache.get(src)!;
    }

    // ─── Label ───────────────────────────────────────────────────
    private drawLabel(button: Button, style: ButtonStyle, color: string) {
        const {ctx} = this;
        const { x, y, width, height } = button.bounds;
        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle = color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(style.label, x + width / 2, y + height - 6);
    }
}

// ─── Color helpers ────────────────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
        ? {r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16)}
        : null;
}

function luminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0.5;
    return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function shade(hex: string, factor: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * factor)));
    return `#${[f(rgb.r), f(rgb.g), f(rgb.b)]
        .map(v => v.toString(16).padStart(2, '0'))
        .join('')}`;
}

function withAlpha(color: string, alpha: number): string {
    if (color.startsWith('#') && color.length === 7) {
        const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return color + a;
    }
    return color;
}