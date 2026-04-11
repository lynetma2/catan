// hud/panels/overview/PlayerOverviewPanel.ts
import {type NormalizedInputEvent} from '@/game/core/Input/InputEvent.ts';
import {type ResolutionManager} from '@/game/core/ResolutionManager.ts';
import type {Resource} from "@/game/core/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {type TradeOfferPanelData, TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";

export abstract class TradeOfferBasePanel<Tstate> { //TODO should extend base panel.
    // Panel owns this state — no other system needs it
    protected localPlayerGiving: Resource[];
    protected localPlayerRecieving: Resource[];
    protected tradeOfferId: string;
    protected tradeOwnerId: string;
    protected playerResponses: Map<string, TradeOfferResponseKind>;
    protected timer: number; //TODO make this better.

    constructor(
        protected readonly resolution: ResolutionManager,
        protected readonly frameQueue: FrameQueue,
        protected readonly sharedState: SharedState,
        data: TradeOfferPanelData
    ) {
        this.tradeOfferId = data.tradeOfferId;
        this.tradeOwnerId = data.tradeOwnerId;
        this.playerResponses = this.transformPlayerResponses(data.playerResponses);

        if (this.isLocalPlayerTrade(sharedState.localPlayerId, data.tradeOwnerId)) {
            this.localPlayerGiving = data.offeredResources;
            this.localPlayerRecieving = data.wantedResources;
        } else {
            this.localPlayerGiving = data.wantedResources;
            this.localPlayerRecieving = data.offeredResources;
        }

        this.timer = 50;
    }

    private isLocalPlayerTrade(localPlayer: string | null, tradeOwnerId: string): boolean {
        return localPlayer === tradeOwnerId;
    }

    private transformPlayerResponses(responses: { playerId: string, response: TradeOfferResponseKind }[]) {
        const playerResponseMap = new Map<string, TradeOfferResponseKind>();
        responses.forEach((response) => {
            playerResponseMap.set(response.playerId, response.response);
        });
        return playerResponseMap;
    }

    public getTradeOfferId() {
        return this.tradeOfferId;
    }

    abstract updatePlayerResponse(playerId: string, response: TradeOfferResponseKind): void;

    abstract handleInput(_event: NormalizedInputEvent): boolean;

    abstract getState(): Tstate;
}