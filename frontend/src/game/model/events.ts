import {EventType} from "@/game/model/enums.ts";
import type {Edge, GameState, Hex, ResourceCollection, Vertex} from "@/game/model/types.ts";

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
    dice?: [number, number];
}

export interface TransferResourcesEvent extends GameEventBase {
    type: EventType.TransferResources;
    fromPlayerId: string | "Bank";
    toPlayerId: string | "Bank";
    resources?: Partial<ResourceCollection>; // If visible to the client
    count?: number; // If the type is hidden (or total count)
}

export interface GameErrorEvent extends GameEventBase {
    type: EventType.Error;
    code: string; // e.g. "INSUFFICIENT_RESOURCES", "CONNECTION_LOST"
    message: string; // User-facing message
    originalEventType?: EventType; // The event that caused the error
}

export interface InitializeGameEvent extends GameEventBase {
    type: EventType.InitializeGame;
    gameState: GameState;
}

export interface MoveRobberEvent extends GameEventBase {
    type: EventType.MoveRobber;
    hex: Hex;
}

export interface RobberTriggeredEvent extends GameEventBase {
    type: EventType.RobberTriggered;
}

export interface StealResourceEvent extends GameEventBase {
    type: EventType.StealResource;
    targetPlayerId: string;
    resource?: string; // Optional (if known/chosen), otherwise random
}

export interface DiscardResourcesEvent extends GameEventBase {
    type: EventType.DiscardResources;
    resources: Record<string, number>;
}

export type GameEvent =
    | BuildRoadEvent
    | BuildSettlementEvent
    | BuildCityEvent
    | BuyDevelopmentCardEvent
    | EndTurnEvent
    | RollDiceEvent
    | TransferResourcesEvent
    | GameErrorEvent
    | InitializeGameEvent
    | MoveRobberEvent
    | RobberTriggeredEvent
    | StealResourceEvent
    | DiscardResourcesEvent;