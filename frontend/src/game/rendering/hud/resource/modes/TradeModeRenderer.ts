import {TradeButtonType, type TradeModeState, TradePanelKind} from '@/game/hud/panels/resource/types';
import {type ResourceCardRenderer} from '../ResourceCardRenderer';
import {type PanelTheme} from '@/game/rendering/theme/theme';
import {drawPanelChrome} from '../../panelChrome';
import {type Rect} from '@/game/utils/Rect';

const TRADE_PANEL_THEME: PanelTheme = {
    background:   'rgba(20, 30, 50, 0.75)',
    borderColor:  'rgba(100, 200, 255, 0.15)',
    borderWidth:  1,
    borderRadius: 10,
    titleFont:    'bold 11px monospace',
    titleColor:   'rgba(150, 210, 255, 0.5)',
    titlePadding: 12,
};

const BUTTON_THEMES: Record<TradeButtonType, { fill: string; stroke: string; label: string }> = {
    [TradeButtonType.Cancel]: {
        fill:   'rgba(120, 40, 40, 0.85)',
        stroke: 'rgba(255, 100, 100, 0.6)',
        label:  'Cancel',
    },
    [TradeButtonType.ConfirmGlobal]: {
        fill:   'rgba(30, 100, 50, 0.85)',
        stroke: 'rgba(100, 255, 140, 0.6)',
        label:  'Announce',
    },
    [TradeButtonType.ConfirmBank]: {
        fill:   'rgba(30, 80, 160, 0.85)',
        stroke: 'rgba(100, 180, 255, 0.6)',
        label:  'Trade Bank',
    },
};

const BUTTON_DISABLED = {fill: 'rgba(60,60,60,0.5)', stroke: 'rgba(120,120,120,0.3)'};
const BUTTON_HOVER_OVERLAY = 'rgba(255, 255, 255, 0.08)';

export class TradeModeRenderer {
    constructor(
        private readonly ctx:          CanvasRenderingContext2D,
        private readonly cardRenderer: ResourceCardRenderer,
    ) {}

    render(state: TradeModeState) {
        // ── Panel chrome ──────────────────────────────────────────────────────
        drawPanelChrome(this.ctx, state[TradePanelKind.Offered].bounds, 'You Offer', TRADE_PANEL_THEME);
        drawPanelChrome(this.ctx, state[TradePanelKind.Wanted].bounds, 'You Want', TRADE_PANEL_THEME);
        drawPanelChrome(this.ctx, state[TradePanelKind.Selector].bounds, 'Select Resources', TRADE_PANEL_THEME);

        // ── Cards — hand already drawn by ResourcePanelRenderer ───────────────
        this.cardRenderer.renderCards(state[TradePanelKind.Offered].cards);
        this.cardRenderer.renderCards(state[TradePanelKind.Wanted].cards);
        this.cardRenderer.renderCards(state[TradePanelKind.Selector].cards);

        // ── Buttons ───────────────────────────────────────────────────────────
        this.drawButton(state.buttons.cancel, TradeButtonType.Cancel, true, state.hoveredButton === TradeButtonType.Cancel);
        this.drawButton(state.buttons.confirmGlobal, TradeButtonType.ConfirmGlobal, true, state.hoveredButton === TradeButtonType.ConfirmGlobal);
        this.drawButton(state.buttons.confirmBank, TradeButtonType.ConfirmBank, true, state.hoveredButton === TradeButtonType.ConfirmBank);
    }

    private drawButton(bounds: Rect, kind: TradeButtonType, enabled: boolean, hovered: boolean) {
        const { ctx } = this;
        const theme   = BUTTON_THEMES[kind];
        const fill    = enabled ? theme.fill   : BUTTON_DISABLED.fill;
        const stroke  = enabled ? theme.stroke : BUTTON_DISABLED.stroke;

        ctx.save();

        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 6);
        ctx.fillStyle = fill;
        ctx.fill();

        if (hovered && enabled) {
            ctx.fillStyle = BUTTON_HOVER_OVERLAY;
            ctx.fill();
        }

        ctx.strokeStyle = stroke;
        ctx.lineWidth   = hovered && enabled ? 2 : 1.5;
        ctx.stroke();

        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle = enabled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(theme.label, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

        ctx.restore();
    }
}