import {
    type ResourceCard,
    ResourcePanelModeKind,
    type ResourcePanelModeState,
    TradePanelKind,
} from '@/game/hud/panels/resource/types';
import {type Rect} from '@/game/utils/Rect';
import {type PanelTheme} from '@/game/rendering/theme/theme';
import {drawPanelChrome} from '../panelChrome';
import {ResourceCardRenderer} from './ResourceCardRenderer';
import {BrowseModeRenderer} from './modes/BrowseModeRenderer';
import {DiscardModeRenderer} from './modes/DiscardModeRenderer';
import {TradeModeRenderer} from './modes/TradeModeRenderer';

const RESOURCE_PANEL_THEME: PanelTheme = {
    background:   'rgba(28, 18, 10, 0.85)',
    borderColor:  'rgba(255, 200, 100, 0.12)',
    borderWidth:  1,
    borderRadius: 10,
    titleFont:    'bold 11px monospace',
    titleColor:   'rgba(255, 200, 100, 0.4)',
    titlePadding: 12,
};

export class ResourcePanelRenderer {
    private readonly cardRenderer:        ResourceCardRenderer;
    private readonly browseModeRenderer:  BrowseModeRenderer;
    private readonly discardModeRenderer: DiscardModeRenderer;
    private readonly tradeModeRenderer:   TradeModeRenderer;

    constructor(
        private readonly ctx: CanvasRenderingContext2D
    ) {
        this.cardRenderer = new ResourceCardRenderer(ctx);
        this.browseModeRenderer = new BrowseModeRenderer(ctx, this.cardRenderer);
        this.discardModeRenderer = new DiscardModeRenderer(ctx);
        this.tradeModeRenderer = new TradeModeRenderer(ctx, this.cardRenderer);
    }

    render(state: ResourcePanelModeState) {
        switch (state.kind) {
            case ResourcePanelModeKind.Browse:
                this.renderHandChrome(state.hand);
                this.browseModeRenderer.render(state);
                break;
            case ResourcePanelModeKind.Discard:
                this.renderHandChrome(state.hand);
                this.discardModeRenderer.render(state);
                break;
            case ResourcePanelModeKind.Trade:
                this.renderHandChrome(state[TradePanelKind.Hand]);
                this.tradeModeRenderer.render(state);
                break;
        }
    }

    private renderHandChrome(hand: { bounds: Rect; cards: ResourceCard[] }) {
        drawPanelChrome(this.ctx, hand.bounds, 'Hand', RESOURCE_PANEL_THEME);

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