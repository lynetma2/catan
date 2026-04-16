// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import type {TradeButtonType} from "@/game/hud/panels/resource/types.ts";
import {
    type TradeOfferIncomingState,
    TradeOfferKind,
    type TradeOfferPanelData
} from "@/game/hud/panels/tradeOffer/types.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import {
    resolvePlayerResponses,
    resolveResponseButtons,
    resolveTradeCards,
    resolveTradeOfferPanelBounds
} from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";

export class TradeOfferIncomingPanel extends TradeOfferBasePanel<TradeOfferIncomingState> {
    // // Panel owns this state — no other system needs it
    private hoveringButton: TradeButtonType | null = null;
    private hoveredCardId: string | null = null;
    private panelData: TradeOfferPanelData;

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData
    ) {
        super(resolution, frameQueue, sharedState, data);
        this.panelData = data;
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display only for now
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(index: number): TradeOfferIncomingState {
        //TODO implement this.
        const bounds = resolveTradeOfferPanelBounds(this.resolution.get(), index);

        const tradeCards = resolveTradeCards(bounds,
            this.panelData.wantedResources,
            this.panelData.offeredResources,
            this.hoveredCardId,
            this.resolution.get()
            );

        const playerResponses = resolvePlayerResponses(bounds,
            this.panelData.playerResponses, this.resolution.get());

        const buttons = resolveResponseButtons(bounds, this.resolution.get());

        return {
            kind: TradeOfferKind.Incoming,
            bounds,
            ...tradeCards,
            playerResponses,
            tradeOfferId: this.panelData.tradeOfferId,
            tradeOwnerId: this.panelData.tradeOwnerId,
            timer: 0,
            buttons: {
                accept: buttons.acceptBounds,
                decline: buttons.rejectBounds
            },
            hoveredButton: undefined
        }
    }
}