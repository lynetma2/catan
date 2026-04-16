import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";
import type {Resource} from "@/game/core/types.ts";

export interface TradeOfferBaseState {
    bounds: Rect;
    wantedResources: { bounds: Rect; cards: ResourceCard[] };
    offeredResources: { bounds: Rect; cards: ResourceCard[] };
    playerResponses: {
        bounds: Rect;
        playerResponseStates: PlayerResponseState[];
    };
    tradeOfferId: string;
    tradeOwnerId: string;
    timer: number;
}

export interface TradeOfferPanelCardsState {
    wantedResources: { bounds: Rect; cards: ResourceCard[] };
    offeredResources: { bounds: Rect; cards: ResourceCard[] };
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

export enum TradeOfferKind {
    Incoming = "Incoming",
    Outgoing = "Outgoing"
}

export interface TradeOfferIncomingState extends TradeOfferBaseState {
    kind: TradeOfferKind.Incoming;
    buttons: {
        accept: Rect;
        decline: Rect;
    }
    hoveredButton?: TradeOfferIncomingButtonType;
}

export interface TradeOfferOutgoingState extends TradeOfferBaseState {
    kind: TradeOfferKind.Outgoing;
    hoveredResponse: string; //PlayerId
    hoveredButton: string;
}

export interface TradeOfferPanelData {
    kind: TradeOfferKind;
    tradeOfferId: string,
    tradeOwnerId: string,
    wantedResources: Resource[],
    offeredResources: Resource[],
    playerResponses: {
        playerId: string,
        response: TradeOfferResponseKind
    }[]
}

export interface TradeOfferManagerState {
    activeTradePanels: (TradeOfferIncomingState | TradeOfferOutgoingState)[];
}

export interface PlayerResponseState {
    playerId: string;
    response: TradeOfferResponseKind;
    chip: ChipLayout;
}

export interface ChipLayout {
    cx: number;
    cy: number;
    radius: number;
    dotCx: number;
    dotCy: number;
    dotRadius: number;
    initial: string;
}

export interface ButtonLayout {
    acceptBounds: Rect;
    rejectBounds: Rect;
}