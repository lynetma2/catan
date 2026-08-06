import {
    type TradeOfferBaseState,
    TradeOfferIncomingButtonType,
    type TradeOfferIncomingState,
    TradeOfferKind,
    type TradeOfferManagerState,
    TradeOfferOutgoingButtonType,
    type TradeOfferOutgoingState,
} from "@/game/hud/panels/tradeOffer/types.ts";
import {ResourceCardRenderer} from "@/game/rendering/hud/resource/ResourceCardRenderer.ts";
import {ResponseRenderer} from "@/game/rendering/hud/tradeOffer/ResponseRenderer.ts";
import {defaultPlayerResponseTheme} from "@/game/rendering/hud/tradeOffer/PlayerResponseTheme.ts";
import {drawPanelChrome} from "@/game/rendering/hud/panelChrome.ts";
import {type PanelTheme} from "@/game/rendering/theme/theme.ts";
import type {Rect} from "@/game/utils/Rect.ts";

const TRADE_PANEL_THEME: PanelTheme = {
    background: 'rgba(28, 18, 10, 0.95)',
    borderColor: 'rgba(255, 200, 100, 0.25)',
    borderWidth: 1,
    borderRadius: 10,
    titleFont: 'bold 11px monospace',
    titleColor: 'rgba(255, 200, 100, 0.6)',
    titlePadding: 12,
};

// ─── Text fitting helpers ─────────────────────────────────────────────
function parseFontPx(font: string): number {
    const match = /(\d+(?:\.\d+)?)px/.exec(font);
    return match ? Number(match[1]) : 11;
}

function setFontPx(font: string, px: number): string {
    const rounded = Math.max(1, Math.round(px));
    if (!/\d+(?:\.\d+)?px/.test(font)) return `${rounded}px sans-serif`;
    return font.replace(/\d+(?:\.\d+)?px/, `${rounded}px`);
}

/** Shrinks (and if needed truncates) text so it fits inside maxWidth. */
function fitCanvasText(
    ctx: CanvasRenderingContext2D,
    rawText: string,
    font: string,
    maxWidth: number,
    minFontSize = 9,
): { font: string; text: string } {
    const text = rawText.trim();
    const basePx = parseFontPx(font);
    let size = basePx;
    let currentFont = setFontPx(font, size);
    ctx.font = currentFont;

    if (!text || maxWidth <= 0) return {font: currentFont, text};

    while (size > minFontSize && ctx.measureText(text).width > maxWidth) {
        size -= 1;
        currentFont = setFontPx(font, size);
        ctx.font = currentFont;
    }

    let fittedText = text;
    if (ctx.measureText(fittedText).width > maxWidth) {
        const ellipsis = "…";
        while (fittedText.length > 0 && ctx.measureText(fittedText + ellipsis).width > maxWidth) {
            fittedText = fittedText.slice(0, -1);
        }
        fittedText = fittedText.length > 0 ? fittedText + ellipsis : text.charAt(0);
    }

    return {font: currentFont, text: fittedText};
}

// ─── Renderer ─────────────────────────────────────────────────────────
export class TradeOfferRenderer {
    private readonly responseRenderer: ResponseRenderer;
    private readonly cardRenderer: ResourceCardRenderer;

    constructor(private readonly ctx: CanvasRenderingContext2D) {
        this.responseRenderer = new ResponseRenderer(ctx, defaultPlayerResponseTheme);
        this.cardRenderer = new ResourceCardRenderer(ctx);
    }

    render(state: TradeOfferManagerState): void {
        state.activeTradePanels.forEach(offer => {
            if (offer.kind === TradeOfferKind.Incoming) {
                this.renderIncoming(offer);
            } else {
                this.renderOutgoing(offer);
            }
        });
    }

    renderIncoming(state: TradeOfferIncomingState): void {
        drawPanelChrome(this.ctx, state.bounds, 'Incoming Trade', TRADE_PANEL_THEME);
        this.renderCards(state, "THEY OFFER", "THEY WANT");
        this.responseRenderer.render(state.playerResponses.playerResponseStates, false, null);
        this.renderIncomingButtons(state);
    }

    renderOutgoing(state: TradeOfferOutgoingState): void {
        drawPanelChrome(this.ctx, state.bounds, 'Your Trade', TRADE_PANEL_THEME);
        this.renderCards(state, "YOU OFFER", "YOU WANT");
        this.responseRenderer.render(state.playerResponses.playerResponseStates, true, state.hoveredResponse);
        this.renderOutgoingButtons(state);
    }

    private renderCards(state: TradeOfferBaseState, offerLabel: string, wantLabel: string): void {
        this.renderSection(state.offeredResources.bounds, offerLabel);
        this.renderSection(state.wantedResources.bounds, wantLabel);
        this.cardRenderer.renderCards(state.offeredResources.cards);
        this.cardRenderer.renderCards(state.wantedResources.cards);
    }

    private renderIncomingButtons(state: TradeOfferIncomingState): void {
        this.drawActionButton(state.buttons.accept, "Accept", "#2d6a2d", state.hoveredButton === TradeOfferIncomingButtonType.Accept);
        this.drawActionButton(state.buttons.decline, "Decline", "#8a2a2a", state.hoveredButton === TradeOfferIncomingButtonType.Decline);
    }

    private renderOutgoingButtons(state: TradeOfferOutgoingState): void {
        this.drawActionButton(state.buttons.cancel, "Cancel Offer", "#8a5a2a", state.hoveredButton === TradeOfferOutgoingButtonType.Cancel);
    }

    private drawActionButton(bounds: Rect, label: string, color: string, isHovered: boolean): void {
        const ctx = this.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 4);
        ctx.fillStyle = color;
        ctx.fill();

        if (isHovered) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Keep the label inside the button, with 8px padding each side
        const maxWidth = bounds.width - 8 * 2;
        const fitted = fitCanvasText(ctx, label, 'bold 11px monospace', maxWidth);

        ctx.font = fitted.font;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fitted.text, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

        ctx.restore();
    }

    private renderSection(bounds: Rect, label: string): void {
        const ctx = this.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 200, 100, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Drawn inside the 14px SECTION_LABEL_HEIGHT reserved by the layout
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, bounds.x + 6, bounds.y - 4);

        ctx.restore();
    }
}