import {
    type ButtonLayout,
    type TradeOfferBaseState, TradeOfferIncomingButtonType,
    type TradeOfferIncomingState,
    type TradeOfferOutgoingState
} from "@/game/hud/panels/tradeOffer/types.ts";
import {ResourceCardRenderer} from "@/game/rendering/hud/resource/ResourceCardRenderer.ts";
import {ResponseRenderer} from "@/game/rendering/hud/tradeOffer/ResponseRenderer.ts";
import {
    ButtonRenderer,
    type ButtonRenderState,
    defaultButtonRendererTheme
} from "@/game/rendering/hud/tradeOffer/ButtonRenderer.ts";
import {defaultPlayerResponseTheme} from "@/game/rendering/hud/tradeOffer/PlayerResponseTheme.ts";
import type {Rect} from "@/game/utils/Rect.ts";

export interface TradeOfferRendererTheme {
    panel: PanelColors;
}

export interface PanelColors {
    background: string;
    border:     string;
    radius:     number;
}

export const defaultTradeOfferRendererTheme: TradeOfferRendererTheme = {
    panel: {
        background: "#1e1a14",
        border:     "#3a3020",
        radius:     6,
    },
};

export class TradeOfferRenderer {
    private readonly buttonRenderer:   ButtonRenderer;
    private readonly responseRenderer: ResponseRenderer;
    private readonly cardRenderer:     ResourceCardRenderer;

    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: TradeOfferRendererTheme = defaultTradeOfferRendererTheme,
    ) {
        this.buttonRenderer   = new ButtonRenderer(ctx, defaultButtonRendererTheme);
        this.responseRenderer = new ResponseRenderer(ctx, defaultPlayerResponseTheme);
        this.cardRenderer     = new ResourceCardRenderer(ctx);
    }

    render(state: TradeOfferIncomingState | TradeOfferOutgoingState): void {
        if ("buttons" in state && "accept" in state.buttons) {
            this.renderIncoming(state as TradeOfferIncomingState);
        } else {
            this.renderOutgoing(state as TradeOfferOutgoingState);
        }
    }

    renderIncoming(state: TradeOfferIncomingState): void {
        this.renderPanel(state.bounds);
        this.renderCards(state);
        this.renderResponses(state);
        this.renderButtons(state);
    }

    renderOutgoing(state: TradeOfferOutgoingState): void {
        this.renderPanel(state.bounds);
        this.renderCards(state);
        this.renderResponses(state);
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private renderPanel(bounds: Rect): void {
        const ctx = this.ctx;
        const { x, y, width, height } = bounds;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, this.theme.panel.radius);
        ctx.fillStyle = this.theme.panel.background;
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, this.theme.panel.radius);
        ctx.strokeStyle = this.theme.panel.border;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    private renderCards(state: TradeOfferBaseState): void {
        this.cardRenderer.renderCards(state.wantedResources.cards);
        this.cardRenderer.renderCards(state.offeredResources.cards);
    }

    private renderResponses(state: TradeOfferBaseState): void {
        this.responseRenderer.render(
            state.playerResponses.playerResponseStates,
        );
    }

    private renderButtons(state: TradeOfferIncomingState): void {
        const buttonLayout: ButtonLayout = {
            acceptBounds: state.buttons.accept,
            rejectBounds: state.buttons.decline,
        };

        const interaction: ButtonRenderState = {
            accept: state.hoveredButton === TradeOfferIncomingButtonType.Accept  ? "hovered" : "idle",
            reject: state.hoveredButton === TradeOfferIncomingButtonType.Decline ? "hovered" : "idle",
        };

        this.buttonRenderer.render(buttonLayout, interaction);
    }
}