import {EventType} from "@/game/model/enums.ts";
import type {Edge, Vertex} from "@/game/model/types.ts";

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

export type GameEvent =
    | BuildRoadEvent
    | BuildSettlementEvent
    | BuildCityEvent
    | BuyDevelopmentCardEvent
    | EndTurnEvent
    | RollDiceEvent;