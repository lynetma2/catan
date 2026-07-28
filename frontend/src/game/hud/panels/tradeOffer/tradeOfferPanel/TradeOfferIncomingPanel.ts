import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {
    type ButtonLayout,
    TradeOfferIncomingButtonType,
    type TradeOfferIncomingState,
    TradeOfferKind,
    type TradeOfferPanelData,
    TradeOfferResponseKind,
} from "@/game/hud/panels/tradeOffer/types.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import {
    resolvePlayerResponses,
    resolveResponseButtons,
    resolveTradeCards,
    resolveTradeOfferPanelBounds,
} from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";

export class TradeOfferIncomingPanel extends TradeOfferBasePanel<TradeOfferIncomingState> {
    private hoveredButton: TradeOfferIncomingButtonType | undefined = undefined;
    private hoveredCardId: string | null = null;

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue<GameEventMap>,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData,
    ) {
        super(resolution, frameQueue, sharedState, data);
    }

    // ─── Input ────────────────────────────────────────────────────────
    handleInput(
        event: NormalizedInputEvent,
        index: number,
    ): boolean {
        const resolution = this.resolution.get();
        const layout = resolveTradeOfferPanelBounds(
            resolution,
            index,
        );
        const buttons = resolveResponseButtons(
            layout,
            resolution,
        );

        if (event.type === InputType.MouseMove) {
            const hitButton = this.findHitButton(
                buttons,
                event.screenPos,
            );
            this.hoveredButton = hitButton;
            return hitButton != null;
        }

        if (event.type === InputType.MouseClick) {
            const hitButton = this.findHitButton(
                buttons,
                event.screenPos,
            );
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
            return TradeOfferIncomingButtonType.Accept;
        }
        if (containsPoint(buttons.rejectBounds, pos)) {
            return TradeOfferIncomingButtonType.Decline;
        }
        return undefined;
    }


    private handleButtonClick(
        hitButton: TradeOfferIncomingButtonType,
    ): boolean {
        switch (hitButton) {
            case TradeOfferIncomingButtonType.Accept:
                this.frameQueue.push(GameActionEventCreators.acceptPublicTrade(this.tradeOfferId))
                return true;

            case TradeOfferIncomingButtonType.Decline:
                this.frameQueue.push(GameActionEventCreators.declinePublicTrade(this.tradeOfferId))
                return true;
        }
    }


    // ─── State ────────────────────────────────────────────────────────
    getState(index: number): TradeOfferIncomingState {
        const resolution = this.resolution.get();

        const bounds = resolveTradeOfferPanelBounds(
            resolution,
            index,
        );

        const tradeCards = resolveTradeCards(
            bounds,
            this.wantedResources,
            this.offeredResources,
            this.hoveredCardId,
            resolution,
        );

        const playerResponses = resolvePlayerResponses(
            bounds,
            [...this.playerResponses].map(
                ([playerId, response]) => ({
                    playerId,
                    response,
                }),
            ),
            resolution,
        );

        const buttons = resolveResponseButtons(
            bounds,
            resolution,
        );

        return {
            kind: TradeOfferKind.Incoming,
            bounds,
            ...tradeCards,
            playerResponses,
            tradeOfferId: this.tradeOfferId,
            tradeOwnerId: this.tradeOwnerId,
            timer: this.timer,
            buttons: {
                accept: buttons.acceptBounds,
                decline: buttons.rejectBounds,
            },
            hoveredButton: this.hoveredButton,
        };
    }


    // ─── Response updates ─────────────────────────────────────────────
    updatePlayerResponse(
        playerId: string,
        response: TradeOfferResponseKind,
    ): void {
        this.playerResponses.set(
            playerId,
            response,
        );
    }
}