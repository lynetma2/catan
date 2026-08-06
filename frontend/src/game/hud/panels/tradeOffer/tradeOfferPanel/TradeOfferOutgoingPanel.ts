import {InputType, isPointerEvent, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {
    TradeOfferKind,
    TradeOfferOutgoingButtonType,
    type TradeOfferOutgoingState,
    type TradeOfferPanelData,
    TradeOfferResponseKind,
} from "@/game/hud/panels/tradeOffer/types.ts";
import {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import {
    resolveOutgoingButtons,
    resolvePlayerResponses,
    resolveTradeCards,
    resolveTradeOfferPanelBounds,
} from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {vec2} from "@/game/utils/Vec2.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";
import {containsPoint} from "@/game/utils/Rect.ts";

export class TradeOfferOutgoingPanel extends TradeOfferBasePanel<TradeOfferOutgoingState> {
    private hoveredPlayerId: string | null = null;
    private hoveredButton: TradeOfferOutgoingButtonType | null = null;

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue<GameEventMap>,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData,
    ) {
        super(resolution, frameQueue, sharedState, data);
    }

    handleInput(event: NormalizedInputEvent, index: number): boolean {
        if (!isPointerEvent(event)) {
            return false;
        }
        const resolution = this.resolution.get();
        const bounds = resolveTradeOfferPanelBounds(resolution, index);
        const playerResponses = resolvePlayerResponses(
            bounds,
            this.resolvePlayerResponseInputs(),
            resolution,
        );
        const buttons = resolveOutgoingButtons(bounds, resolution);

        const hitAcceptedPlayer = playerResponses.playerResponseStates.find(pr => {
            if (pr.response !== TradeOfferResponseKind.Accept) return false;
            return vec2.distance(event.screenPos, {x: pr.chip.cx, y: pr.chip.cy}) <= pr.chip.radius;
        });
        const hitCancel = containsPoint(buttons.cancel, event.screenPos);

        if (event.type === InputType.MouseMove) {
            this.hoveredPlayerId = hitAcceptedPlayer ? hitAcceptedPlayer.playerId : null;
            this.hoveredButton = hitCancel ? TradeOfferOutgoingButtonType.Cancel : null;
            return this.hoveredPlayerId !== null || this.hoveredButton !== null;
        }

        if (event.type === InputType.MouseClick) {
            if (this.hoveredButton === TradeOfferOutgoingButtonType.Cancel) {
                this.frameQueue.push(GameActionEventCreators.cancelPublicTrade(this.tradeOfferId));
                return true;
            }
            if (hitAcceptedPlayer) {
                this.frameQueue.push(GameActionEventCreators.confirmPublicTrade(
                    this.tradeOfferId, hitAcceptedPlayer.playerId
                ));
                return true;
            }
        }
        return false;
    }

    updatePlayerResponse(
        playerId: string,
        response: TradeOfferResponseKind,
    ): void {
        this.playerResponses.set(playerId, response);
    }

    getState(index: number): TradeOfferOutgoingState {
        const resolution = this.resolution.get();

        const bounds = resolveTradeOfferPanelBounds(
            resolution,
            index,
        );

        const tradeCards = resolveTradeCards(
            bounds,
            this.wantedResources,
            this.offeredResources,
            null,
            resolution,
        );

        const playerResponses = resolvePlayerResponses(
            bounds,
            this.resolvePlayerResponseInputs(),
            resolution,
        );

        const buttons = resolveOutgoingButtons(bounds, resolution);

        return {
            kind: TradeOfferKind.Outgoing,
            bounds,
            ...tradeCards,
            playerResponses,
            tradeOfferId: this.tradeOfferId,
            tradeOwnerId: this.tradeOwnerId,
            timer: this.timer,
            buttons,
            hoveredResponse: this.hoveredPlayerId ?? "",
            hoveredButton: this.hoveredButton,
        };
    }
}