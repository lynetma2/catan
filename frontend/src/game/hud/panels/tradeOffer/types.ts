import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";

export interface TradeOfferBaseState {
    bounds: Rect;
    incomingResources: { bounds: Rect; cards: ResourceCard[] };
    outgoingResources: { bounds: Rect; cards: ResourceCard[] };
    tradeOfferId: string;
    tradeOwnerId: string;
    timer: number;
}

export enum TradeOfferIncomingButtonType {
    Accept = "Accept",
    Decline = "Decline"
}

export enum TradeOfferResponseKind {
    Accept = "Accept",
    Decline = "Decline",
    NoAnswer = "NoAnswer"
}

export interface TradeOfferIncomingState extends TradeOfferBaseState {
    response: TradeOfferResponseKind;
    buttons: {
        accept: Rect;
        decline: Rect;
    }
    hoveredButton: TradeOfferIncomingButtonType;
}

export interface TradeOfferOutgoingState extends TradeOfferBaseState {
    playerResponses: {
        playerId: string;
        response: TradeOfferResponseKind;
        bounds: Rect;
    }
    hoveredResponse: string; //PlayerId
}