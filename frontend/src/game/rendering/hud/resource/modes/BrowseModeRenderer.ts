import type {BrowseModeState} from '@/game/hud/panels/resource/types';
import type {ResourceCardRenderer} from '../ResourceCardRenderer';
import type {DevelopmentCardRenderer} from '../DevelopmentCardRenderer';
import type {PanelTheme} from '@/game/rendering/theme/theme';
import type {Rect} from '@/game/utils/Rect';
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";

const BROWSE_THEME: PanelTheme = {
    background: 'rgba(28, 18, 10, 0.85)',
    borderColor: 'rgba(255, 200, 100, 0.12)',
    borderWidth: 1,
    borderRadius: 10,
    titleFont: 'bold 11px monospace',
    titleColor: 'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

const BROWSE_THEME_AT_RISK: PanelTheme = {
    ...BROWSE_THEME,
    background: 'rgba(64, 20, 16, 0.85)',
    borderColor: 'rgba(255, 120, 90, 0.25)',
};

export class BrowseModeRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly resCardRenderer: ResourceCardRenderer,
        private readonly devCardRenderer: DevelopmentCardRenderer,
    ) {
    }

    render(state: BrowseModeState) {
        const {bounds, resCards, devCards} = state.hand;
        const theme = state.isAtDiscardRisk ? BROWSE_THEME_AT_RISK : BROWSE_THEME;
        drawPanelChrome(this.ctx, bounds, 'Hand', theme);

        const totalCards = resCards.length + devCards.length;
        if (totalCards === 0) {
            this.drawEmptyState(bounds);
            return;
        }

        // Render non‑hovered cards first, then hovered to keep them on top
        const allCards: Array<{ isHovered: boolean }> = [];

        // Dev cards
        devCards.forEach(c => allCards.push(c));
        // Res cards
        resCards.forEach(c => allCards.push(c));

        // Draw non‑hovered
        this.devCardRenderer.renderCards(devCards.filter(c => !c.isHovered));
        this.resCardRenderer.renderCards(resCards.filter(c => !c.isHovered));

        // Draw hovered
        this.devCardRenderer.renderCards(devCards.filter(c => c.isHovered));
        this.resCardRenderer.renderCards(resCards.filter(c => c.isHovered));
    }

    private drawEmptyState(bounds: Rect) {
        const {ctx} = this;
        ctx.save();
        ctx.font = '11px monospace';
        ctx.fillStyle = 'rgba(255, 200, 100, 0.25)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'No resources',
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
        );
        ctx.restore();
    }
}