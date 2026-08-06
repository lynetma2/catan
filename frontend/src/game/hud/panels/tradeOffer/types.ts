import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";
import {type Resource, ResourceType} from "@/game/core/types.ts";

export interface TradeOfferDTO {
    tradeOfferId: string;
    tradeOwnerId: string;
    wantedResources: ResourceType[];
    offeredResources: Resource[];
    playerResponses: TradePlayerResponse[];
}

export interface TradePlayerResponse {
    playerId: string;
    response: TradeOfferResponseKind;
}

/** Raw response enriched with display data resolved from SharedState. */
export interface PlayerResponseInput {
    playerId: string;
    response: TradeOfferResponseKind;
    name: string;
    color: string;
}

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
    Accept = "accept",
    Decline = "decline"
}

export enum TradeOfferOutgoingButtonType {
    Cancel = "cancel"
}

export enum TradeOfferResponseKind {
    Accept = "accept",
    Decline = "decline",
    NoAnswer = "noAnswer"
}

export enum TradeOfferKind {
    Incoming = "incoming",
    Outgoing = "outgoing"
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
    hoveredResponse: string | null; //PlayerId
    hoveredButton: TradeOfferOutgoingButtonType | null;
    buttons: {
        cancel: Rect;
    }
}

export interface TradeOfferPanelData {
    kind: TradeOfferKind;
    tradeOfferId: string,
    tradeOwnerId: string,
    wantedResources: ResourceType[],
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
    initial: string;     // first letter of the player's NAME
    color: string;       // real player color → ring & glow
    background: string;  // darkened player color → chip fill & dot gap
    textColor: string;   // lightened player color → letter
}

export interface ButtonLayout {
    acceptBounds: Rect;
    rejectBounds: Rect;
}