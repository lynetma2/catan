import {EventType} from "@/game/model/enums.ts";
import type {Edge, ResourceCollection, Vertex} from "@/game/model/types.ts";

export interface GameEventBase {
    type: EventType;
    playerId: string;
}

export interface BuildRoadEvent extends GameEventBase {
    type: EventType.BuildRoad;
    edge: Edge;
}

export interface BuildSettlementEvent extends GameEventBase {
    type: EventType.BuildSettlement;
    vertex: Vertex;
}

export interface BuildCityEvent extends GameEventBase {
    type: EventType.BuildCity;
    vertex: Vertex;
}

export interface BuyDevelopmentCardEvent extends GameEventBase {
    type: EventType.BuyDevelopmentCard;
}

export interface EndTurnEvent extends GameEventBase {
    type: EventType.EndTurn;
}

export interface RollDiceEvent extends GameEventBase {
    type: EventType.RollDice;
}

export interface TransferResourcesEvent extends GameEventBase {
    type: EventType.TransferResources;
    fromPlayerId: string | "Bank";
    toPlayerId: string | "Bank";
    resources?: Partial<ResourceCollection>; // If visible to the client
    count?: number; // If the type is hidden (or total count)
}

export type GameEvent =
    | BuildRoadEvent
    | BuildSettlementEvent
    | BuildCityEvent
    | BuyDevelopmentCardEvent
    | EndTurnEvent
    | RollDiceEvent
    | TransferResourcesEvent;