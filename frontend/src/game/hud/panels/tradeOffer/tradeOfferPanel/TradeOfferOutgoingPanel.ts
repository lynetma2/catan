import {InputType, isPointerEvent, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {
    TradeOfferKind,
    type TradeOfferOutgoingState,
    type TradeOfferPanelData,
    TradeOfferResponseKind,
} from "@/game/hud/panels/tradeOffer/types.ts";
import {TradeOfferBasePanel} from "@/game/hud/panels/tradeOffer/tradeOfferPanel/TradeOfferBasePanel.ts";
import {
    resolvePlayerResponses,
    resolveTradeCards,
    resolveTradeOfferPanelBounds,
} from "@/game/hud/panels/tradeOffer/TradeOfferPanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {vec2} from "@/game/utils/Vec2.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";

export class TradeOfferOutgoingPanel extends TradeOfferBasePanel<TradeOfferOutgoingState> {
    private hoveredPlayerId: string | null = null;

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
            [...this.playerResponses].map(([playerId, response]) => ({
                playerId,
                response,
            })),
            resolution,
        );

        const hitAcceptedPlayer = playerResponses.playerResponseStates.find(pr => {
            if (pr.response !== TradeOfferResponseKind.Accept) return false;
            return vec2.distance(event.screenPos, {x: pr.chip.cx, y: pr.chip.cy}) <= pr.chip.radius;
        });

        if (event.type === InputType.MouseMove) {
            this.hoveredPlayerId = hitAcceptedPlayer ? hitAcceptedPlayer.playerId : null;
            return hitAcceptedPlayer != null;
        }

        if (event.type === InputType.MouseClick) {
            if (hitAcceptedPlayer != null) {
                this.frameQueue.push(GameActionEventCreators.confirmPublicTrade(
                    this.tradeOfferId, hitAcceptedPlayer.playerId
                ))
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
            [...this.playerResponses].map(([playerId, response]) => ({
                playerId,
                response,
            })),
            resolution,
        );

        return {
            kind: TradeOfferKind.Outgoing,
            bounds,
            ...tradeCards,
            playerResponses,
            tradeOfferId: this.tradeOfferId,
            tradeOwnerId: this.tradeOwnerId,
            timer: this.timer,
            hoveredResponse: this.hoveredPlayerId ?? "",
            hoveredButton: "",
        };
    }
}