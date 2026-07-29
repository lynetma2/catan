import {
    type ResourceCard,
    type ResourcePanelManagerState,
    ResourcePanelModeKind,
    TradePanelKind,
} from '@/game/hud/panels/resource/types';
import {type Rect} from '@/game/utils/Rect';
import {type PanelTheme} from '@/game/rendering/theme/theme';
import {drawPanelChrome} from '../panelChrome';
import {ResourceCardRenderer} from './ResourceCardRenderer';
import {BrowseModeRenderer} from './modes/BrowseModeRenderer';
import {DiscardModeRenderer} from './modes/DiscardModeRenderer';
import {TradeModeRenderer} from './modes/TradeModeRenderer';
import {DevelopmentCardRenderer} from "@/game/rendering/hud/resource/DevelopmentCardRenderer.ts";

const RESOURCE_PANEL_THEME: PanelTheme = {
    background:   'rgba(28, 18, 10, 0.85)',
    borderColor:  'rgba(255, 200, 100, 0.12)',
    borderWidth:  1,
    borderRadius: 10,
    titleFont:    'bold 11px monospace',
    titleColor:   'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

const RESOURCE_PANEL_THEME_AT_RISK: PanelTheme = {
    ...RESOURCE_PANEL_THEME,
    background: 'rgba(64, 20, 16, 0.85)',   // warm red-brown, not alarm-red
    borderColor: 'rgba(255, 120, 90, 0.25)', // subtly warmer border to reinforce it
};

export class ResourcePanelRenderer {
    private readonly cardRenderer:        ResourceCardRenderer;
    private readonly devCardRenderer: DevelopmentCardRenderer;
    private readonly browseModeRenderer:  BrowseModeRenderer;
    private readonly discardModeRenderer: DiscardModeRenderer;
    private readonly tradeModeRenderer:   TradeModeRenderer;

    constructor(
        private readonly ctx: CanvasRenderingContext2D
    ) {
        this.cardRenderer = new ResourceCardRenderer(ctx);
        this.devCardRenderer = new DevelopmentCardRenderer(ctx)
        this.browseModeRenderer = new BrowseModeRenderer(ctx, this.cardRenderer, this.devCardRenderer);
        this.discardModeRenderer = new DiscardModeRenderer(ctx);
        this.tradeModeRenderer = new TradeModeRenderer(ctx, this.cardRenderer);
    }

    render(state: ResourcePanelManagerState) {
        const modeState = state.modeState;

        switch (modeState.kind) {
            case ResourcePanelModeKind.Browse:
                this.browseModeRenderer.render(modeState);
                break;
            case ResourcePanelModeKind.Discard:
                this.renderHandChrome(modeState.hand);
                this.discardModeRenderer.render(modeState);
                break;
            case ResourcePanelModeKind.Trade:
                this.renderHandChrome(modeState[TradePanelKind.Hand]);
                this.tradeModeRenderer.render(modeState);
                break;
        }
    }

    private renderHandChrome(hand: { bounds: Rect; cards: ResourceCard[] }, isAtDiscardRisk: boolean = false) {
        const theme = isAtDiscardRisk ? RESOURCE_PANEL_THEME_AT_RISK : RESOURCE_PANEL_THEME;
        drawPanelChrome(this.ctx, hand.bounds, 'Hand', theme);

        if (hand.cards.length > 0) {
            this.cardRenderer.renderCards(hand.cards);
        } else {
            this.drawEmptyState(hand.bounds);
        }
    }

    private drawEmptyState(bounds: Rect) {
        const { ctx } = this;
        ctx.save();
        ctx.font         = '11px monospace';
        ctx.fillStyle    = 'rgba(255, 200, 100, 0.25)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'No resources',
            bounds.x + bounds.width  / 2,
            bounds.y + bounds.height / 2,
        );
        ctx.restore();
    }
}