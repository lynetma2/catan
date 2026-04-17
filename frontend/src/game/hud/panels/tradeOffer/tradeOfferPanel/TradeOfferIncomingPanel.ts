// hud/panels/overview/PlayerOverviewPanel.ts
import {InputType, type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import {DiscardButtonType, type TradeButtonType} from "@/game/hud/panels/resource/types.ts";
import {
    type ButtonLayout,
    TradeOfferIncomingButtonType,
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
import {containsPoint} from "@/game/utils/Rect.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";

export class TradeOfferIncomingPanel extends TradeOfferBasePanel<TradeOfferIncomingState> {
    // // Panel owns this state — no other system needs it
    private hoveredButton: TradeOfferIncomingButtonType | undefined = undefined;
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

    handleInput(event: NormalizedInputEvent, index: number): boolean {
        const r = this.resolution.get();
        const layout = resolveTradeOfferPanelBounds(r, index);
        const buttons = resolveResponseButtons(layout, r);

        if (event.type === InputType.MouseMove) {
            const hitButton = this.findHitButton(buttons, event.screenPos);

            this.hoveredButton = hitButton;
            return hitButton != null;
        }

        if (event.type === InputType.MouseClick) {
            const hitButton = this.findHitButton(buttons, event.screenPos);
            if (hitButton != null) {
                return this.handleButtonClick(hitButton);
            }
        }

        return false;
    }

    private findHitButton(
        buttons: ButtonLayout,
        pos: Vec2,
    ): TradeOfferIncomingButtonType | undefined {
        if (containsPoint(buttons.acceptBounds, pos)) {
            return TradeOfferIncomingButtonType.Accept
        } else if (containsPoint(buttons.rejectBounds, pos)) {
            return TradeOfferIncomingButtonType.Decline
        }
        return undefined;
    }

    private handleButtonClick(hitButton: TradeOfferIncomingButtonType) {
        switch (hitButton) {
            case TradeOfferIncomingButtonType.Accept:
                console.log("Accept clicked");
                return true;
            case TradeOfferIncomingButtonType.Decline:
                console.log("Decline clicked");
                return true;
        }
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
            hoveredButton: this.hoveredButton
        }
    }
}