import {type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {type TradeOfferPanelData, TradeOfferResponseKind,} from "@/game/hud/panels/tradeOffer/types.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import type {Resource, ResourceType} from "@/game/core/types.ts";

export abstract class TradeOfferBasePanel<TState> {
    protected readonly offeredResources;
    protected readonly wantedResources;

    protected readonly tradeOfferId: string;
    protected readonly tradeOwnerId: string;
    protected readonly playerResponses: Map<string, TradeOfferResponseKind>;

    protected timer: number;

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue<GameEventMap>,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData,
    ) {
        this.tradeOfferId = data.tradeOfferId;
        this.tradeOwnerId = data.tradeOwnerId;

        this.offeredResources = data.offeredResources;
        this.wantedResources = this.createFakeResources(data.wantedResources);

        this.playerResponses = new Map(
            data.playerResponses.map(r => [r.playerId, r.response]),
        );

        this.timer = 50;
    }

    public getTradeOfferId(): string {
        return this.tradeOfferId;
    }

    private createFakeResources(types: ResourceType[]): Resource[] {
        return types.map(type => ({
            uid: crypto.randomUUID(),
            resourceType: type,
        }));
    }

    abstract updatePlayerResponse(
        playerId: string,
        response: TradeOfferResponseKind,
    ): void;

    abstract handleInput(
        event: NormalizedInputEvent,
        index: number,
    ): boolean;

    abstract getState(index: number): TState;
}