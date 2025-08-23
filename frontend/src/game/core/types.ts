import type {Hex} from "@/game/hexagon/Hex.ts";
import type { Edge } from "../hexagon/Edge";
import type {Vertex} from "@/game/hexagon/Vertex.ts";
import type {ButtonType} from "@/game/core/Buttons/ButtonType.ts";

export type EventMap = Record<string, unknown>;

export type EventListener<T> = (payload: T) => void;

export type Middleware<T extends EventMap, E extends keyof T> = (
    eventName: E,
    payload: T[E],
    next: (eventName: E, payload: T[E]) => void
) => void;

export type GameEvents = {
    'PlaceHouseEvent': PlaceHouseEvent;
    'PlaceCityEvent': PlaceCityEvent;
    'PlaceRoadEvent': PlaceRoadEvent;
    'PlaceRobberEvent': PlaceRobberEvent;
    'RollDiceEvent': RollDiceEvent;
    'PressedButtonEvent': PressedButtonEvent;
    'NotificationEvent': NotificationEvent;
    'ErrorEvent': ErrorEvent;
}

export interface BaseEvent {
    uid: string;
    timestamp: number; // Unix timestamp
    stopPropagation: boolean; // false if the event should continue to listeners
}

export interface PlaceHouseEvent extends BaseEvent {
    vertex: Vertex;
}

export interface PlaceCityEvent extends BaseEvent {
    vertex: Vertex;
}

export interface RollDiceEvent extends BaseEvent {
    //Empty for now
}

export interface PlaceRoadEvent extends BaseEvent {
    edge: Edge;
}

export interface PlaceRobberEvent extends BaseEvent {
    hex: Hex;
}

export interface PressedButtonEvent extends BaseEvent {
    buttonType: ButtonType;
}

export interface NotificationEvent extends BaseEvent {
    title: string;
}

export interface ErrorEvent extends BaseEvent {
    error: string;
}

export interface Drawable {
    bounds: { x: number; y: number; width: number; height: number };
    color: string;
    canvas: HTMLCanvasElement;
    draw: () => void;
}

export interface Interactive {
    id: string;
    bounds: { x: number; y: number; width: number; height: number };
    onClick?: (event: { x: number, y: number }) => void;
    onHover?: (event: { x: number, y: number }) => void;
    onHoverStart?(event: { x: number; y: number }): void;
    onHoverEnd?(event: { x: number; y: number }): void;
}

export interface Position {
    hex: string;
    corner?: number;
    edge?: number;
}

export interface Resources {
    wood: number;
    brick: number;
    grain: number;
    wool: number;
    ore: number;
}

export interface Player {
    id: string;
    name: string;
    color: string;
    resources: Resources;
    settlements: Position[];
    cities: Position[];
    roads: Position[];
    developmentCards: DevelopmentCard[];
    victoryPoints: number;
    longestRoadLength: number;
    largestArmySize: number;
}

export interface DevelopmentCard {
    type: 'KNIGHT' | 'VICTORY_POINT' | 'ROAD_BUILDING' | 'YEAR_OF_PLENTY' | 'MONOPOLY';
    played: boolean;
}

export interface Trade {
    id: string;
    from: string;
    to: string;
    offering: Resources;
    requesting: Resources;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXECUTED' | 'CANCELLED';
}

// =====================================
// EVENT TYPE DEFINITIONS
// =====================================

export interface BuildSettlementData {
    position: Position;
    playerId: string;
}

export interface BuildRoadData {
    position: Position;
    playerId: string;
}

export interface BuildCityData {
    position: Position;
    playerId: string;
}

export interface RollDiceData {
    playerId: string;
}

export interface TradeData {
    fromPlayer: string;
    toPlayer?: string;
    offering: Resources;
    requesting: Resources;
    tradeType: 'PLAYER_TRADE' | 'PORT_TRADE' | 'BANK_TRADE';
}

export interface ActionFailedData {
    reason: string;
    playerId: string;
    required?: Resources;
    available?: Resources;
}
