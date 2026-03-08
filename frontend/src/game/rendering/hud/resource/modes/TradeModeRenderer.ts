// rendering/hud/resource/modes/TradeModeRenderer.ts
import { drawPanelChrome }               from '../../panelChrome';
import { type TradeModeState,
    type TradeButtonKind }         from '@/game/hud/panels/resource/types';
import { type PanelTheme }               from '@/game/rendering/theme/theme';
import { type ResourceCardRenderer }     from '../ResourceCardRenderer';
import { resolveOfferCards,
    resolveWantedCards,
    resolveSelectorCards,
    resolveTradeLayout }           from '@/game/hud/panels/resource/ResourcePanelLayout';
import { ResolutionManager }             from '@/game/core/ResolutionManager';
import { type Rect }                     from '@/game/utils/Rect';
import { type Resource }                 from '@/game/core/types';

// ─── Themes ───────────────────────────────────────────────────────────────────

const TRADE_PANEL_THEME: PanelTheme = {
    background:   'rgba(20, 30, 50, 0.75)',
    borderColor:  'rgba(100, 200, 255, 0.15)',
    borderWidth:  1,
    borderRadius: 10,
    titleFont:    'bold 11px monospace',
    titleColor:   'rgba(150, 210, 255, 0.5)',
    titlePadding: 12,
};

interface ButtonTheme {
    fill:   string;
    stroke: string;
    label:  string;
}

const BUTTON_THEMES: Record<TradeButtonKind, ButtonTheme> = {
    tradeCancel: {
        fill:   'rgba(120, 40, 40, 0.85)',
        stroke: 'rgba(255, 100, 100, 0.6)',
        label:  'Cancel',
    },
    tradeConfirmGlobal: {
        fill:   'rgba(30, 100, 50, 0.85)',
        stroke: 'rgba(100, 255, 140, 0.6)',
        label:  'Announce',
    },
    tradeConfirmBank: {
        fill:   'rgba(30, 80, 160, 0.85)',
        stroke: 'rgba(100, 180, 255, 0.6)',
        label:  'Trade Bank',
    },
};

const BUTTON_DISABLED = {
    fill:   'rgba(60, 60, 60, 0.5)',
    stroke: 'rgba(120, 120, 120, 0.3)',
};

const BUTTON_HOVER_OVERLAY = 'rgba(255, 255, 255, 0.08)';

// ─── Renderer ─────────────────────────────────────────────────────────────────

export class TradeModeRenderer {
    constructor(
        private readonly ctx:          CanvasRenderingContext2D,
        private readonly cardRenderer: ResourceCardRenderer,
        private readonly resolution:   ResolutionManager,
    ) {}

    render(state: TradeModeState) {
        const r      = this.resolution.get();
        const layout = resolveTradeLayout(r);

        // ── Panel chrome ──────────────────────────────────────────────────────

        drawPanelChrome(this.ctx, layout.offer,    'You Offer',        TRADE_PANEL_THEME);
        drawPanelChrome(this.ctx, layout.wanted,   'You Want',         TRADE_PANEL_THEME);
        drawPanelChrome(this.ctx, layout.selector, 'Select Resources', TRADE_PANEL_THEME);

        // ── Offered cards ─────────────────────────────────────────────────────

        const offeredCards = resolveOfferCards(state.offeredResources, state.hoveredCardId, r)
            .map(c => ({ ...c, isSelected: true }));
        this.cardRenderer.renderCards(offeredCards);

        // ── Wanted cards ──────────────────────────────────────────────────────

        const wantedResources: Resource[] = state.wantedTypes.map((type, i) => ({
            resourceType: type,
            uid:          `wanted-render-${i}`,
        }));
        const wantedCards = resolveWantedCards(wantedResources, state.hoveredCardId, r);
        this.cardRenderer.renderCards(wantedCards);

        // ── Selector cards ────────────────────────────────────────────────────

        const selectorCards = resolveSelectorCards(r, state.hoveredCardId);
        this.cardRenderer.renderCards(selectorCards);

        // ── Buttons ───────────────────────────────────────────────────────────

        this.drawButton(
            layout.cancelButton,
            'tradeCancel',
            true,                       // cancel is always enabled
            state.hoveredButton === 'tradeCancel',
        );
        this.drawButton(
            layout.confirmGlobalButton,
            'tradeConfirmGlobal',
            state.canConfirmGlobal,
            state.hoveredButton === 'tradeConfirmGlobal',
        );
        this.drawButton(
            layout.confirmBankButton,
            'tradeConfirmBank',
            state.canConfirmBank,
            state.hoveredButton === 'tradeConfirmBank',
        );
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private drawButton(
        bounds:    Rect,
        kind:      TradeButtonKind,
        enabled:   boolean,
        hovered:   boolean,
    ) {
        const { ctx } = this;
        const theme   = BUTTON_THEMES[kind];
        const fill    = enabled ? theme.fill   : BUTTON_DISABLED.fill;
        const stroke  = enabled ? theme.stroke : BUTTON_DISABLED.stroke;

        ctx.save();

        // Base shape
        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 6);
        ctx.fillStyle = fill;
        ctx.fill();

        // Hover overlay — brightens the button without changing its colour identity
        if (hovered && enabled) {
            ctx.fillStyle = BUTTON_HOVER_OVERLAY;
            ctx.fill();
        }

        ctx.strokeStyle = stroke;
        ctx.lineWidth   = hovered && enabled ? 2 : 1.5;
        ctx.stroke();

        // Label
        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle    = enabled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.35)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            theme.label,
            bounds.x + bounds.width  / 2,
            bounds.y + bounds.height / 2,
        );

        ctx.restore();
    }
}