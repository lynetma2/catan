// events/GameEventTypes.ts

import {
    type BuildTarget,
    GamePhase,
    type GameSnapshot,
    type PieceType,
    type PlayerSnapshot,
    type Resource
} from "@/game/core/types.ts";
import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {TradeOfferPanelData} from "@/game/hud/panels/tradeOffer/types.ts";
import type {EventBus} from "@/game/core/EventBus.ts"; // Adjust path as needed

export enum GameEventSource {
    Hud = 'hud',
    World = 'world',
    Network = 'network',
    Input = 'input',
}

export enum BuildRejectionReason {
    NOT_YOUR_TURN = 'NOT_YOUR_TURN',
    WRONG_PHASE = 'WRONG_PHASE',
    INSUFFICIENT_RESOURCES = 'INSUFFICIENT_RESOURCES',
    SPOT_OCCUPIED = 'SPOT_OCCUPIED',
    NO_ADJACENT_ROAD = 'NO_ADJACENT_ROAD',
    DISTANCE_RULE_VIOLATED = 'DISTANCE_RULE_VIOLATED',
    NO_SETTLEMENT_TO_UPGRADE = 'NO_SETTLEMENT_TO_UPGRADE',
    INVALID_LOCATION = 'INVALID_LOCATION',
}

export type LegacyGameBus = EventBus<GameEventMap>;

// export const GameEventType = {
//     ui: {
//         buildModeEntered: "ui.build_mode.entered",
//     },
//
//     action: {
//         buildPlace: "action.build.place",
//     },
//
//     server: {
//         buildPlaced: "server.build.placed",
//     },
// } as const;
//
// type ValueOf<T> = T[keyof T];
//
// type DeepValueOf<T> = T extends object ? DeepValueOf<ValueOf<T>> : T;

//export type GameEventType = DeepValueOf<typeof GameEventType>;

// 1. Define the Enum as GameEventType
export enum GameEventType {
    //BUILD_MODE_ENTERED = 'BUILD_MODE_ENTERED',
    //BUILD_MODE_EXITED = 'BUILD_MODE_EXITED',
    //BUILD_PLACEMENT_REQUESTED = 'BUILD_PLACEMENT_REQUESTED',
    //BUILD_PLACED = 'BUILD_PLACED', //Server event
    //BUILD_REJECTED = 'BUILD_REJECTED', //Server event
    //BUILD_SENT_TO_SERVER = 'BUILD_SENT_TO_SERVER', //Action
    //DRAW_DEVELOPMENT_CARD_REQUESTED = 'DRAW_DEVELOPMENT_CARD_REQUESTED',
    //DICE_ROLLED = 'DICE_ROLLED',
    //DICE_ROLL_REQUESTED = 'DICE_ROLL_REQUESTED',
    //END_TURN_REQUESTED = 'END_TURN_REQUESTED',
    //REQUEST_GAME_STATE = 'REQUEST_GAME_STATE',
    //GAME_STATE_LOADED = 'GAME_STATE_LOADED',
    //LARGEST_ARMY_CHANGED = 'LARGEST_ARMY_CHANGED',
    //LONGEST_ROAD_CHANGED = 'LONGEST_ROAD_CHANGED',
    //PANEL_CLOSED = 'PANEL_CLOSED',
    //PANEL_OPENED = 'PANEL_OPENED',
    PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED',
    PLAYER_JOINED = 'PLAYER_JOINED',
    //RESOURCES_GRANTED = 'RESOURCES_GRANTED',
    //RESOURCES_SPENT = 'RESOURCES_SPENT',
    //TOAST_REQUESTED = 'TOAST_REQUESTED',
    //TURN_ENDED = 'TURN_ENDED', //TODO check what kind of event this should be.
    TURN_STARTED = 'TURN_STARTED',
    //VICTORY_POINTS_CHANGED = 'VICTORY_POINTS_CHANGED',
    GAME_STARTED = 'GAME_STARTED',
    //OPPONENT_CARD_COUNT_CHANGED = 'OPPONENT_CARD_COUNT_CHANGED',
    //DISCARD_REQUIRED = 'DISCARD_REQUIRED',
    //DISCARD_CONFIRMED = 'DISCARD_CONFIRMED',
    //CARDS_DISCARDED = 'CARDS_DISCARDED',
    //ROBBER_PLACED = 'ROBBER_PLACED',
    //ROBBER_STEAL_COMPLETE = 'ROBBER_STEAL_COMPLETE',
    //SETUP_TURN_COMPLETED = 'SETUP_TURN_COMPLETED',
    //PHASE_ADVANCED = 'PHASE_ADVANCED',
    //GAME_ENDED = 'GAME_ENDED',
    //TRADE_STARTED = 'TRADE_STARTED',
    //TRADE_ENDED = 'TRADE_ENDED',
    //TRADE_CANCELLED = 'TRADE_CANCELLED',
    //TRADE_CONFIRM_BANK_SENT_TO_SERVER = 'TRADE_CONFIRM_BANK_SENT_TO_SERVER',
    //TRADE_CONFIRM_GLOBAL_SENT_TO_SERVER = 'TRADE_CONFIRM_GLOBAL_SENT_TO_SERVER',
    TRADE_OFFER_INCOME_RECIEVED = 'TRADE_OFFER_INCOME_RECIEVED',
    TRADE_OFFER_OUTGOING_RECIEVED = 'TRADE_OFFER_OUTGOING_RECIEVED',
    TRADE_OFFER_CANCELLED = 'TRADE_OFFER_CANCELLED',
    TRADE_OFFER_ACCEPTED_SENT_TO_SERVER = "TRADE_OFFER_ACCEPTED_SENT_TO_SERVER",
    TRADE_OFFER_ACCEPTED = "TRADE_OFFER_ACCEPTED",
    TRADE_OFFER_DECLINED_SENT_TO_SERVER = "TRADE_OFFER_DECLINED_SENT_TO_SERVER",
    TRADE_OFFER_DECLINED = "TRADE_OFFER_DECLINED",
    GAME_START_REQUESTED = 'GAME_START_REQUESTED',
    GAME_START_REJECTED = 'GAME_START_REJECTED',
    GAME_INITIALIZING = 'GAME_INITIALIZING'
}

// 2. Map the payloads using the GameEventType enum
export interface GameEventMap {
    [GameEventType.BUILD_MODE_ENTERED]: { pieceType: PieceType };
    [GameEventType.BUILD_MODE_EXITED]: Record<string, never>;
    [GameEventType.BUILD_PLACEMENT_REQUESTED]: { pieceType: PieceType; target: BuildTarget };
    [GameEventType.BUILD_PLACED]: { pieceType: PieceType; target: BuildTarget; playerId: string };
    [GameEventType.BUILD_REJECTED]: { pieceType: PieceType; reason: BuildRejectionReason };
    [GameEventType.BUILD_SENT_TO_SERVER]: { pieceType: PieceType; target: BuildTarget; playerId: string };
    [GameEventType.DICE_ROLLED]: { values: [number, number]; total: number };
    [GameEventType.DICE_ROLL_REQUESTED]: Record<string, never>;
    [GameEventType.DRAW_DEVELOPMENT_CARD_REQUESTED]: { playerId: string };
    [GameEventType.END_TURN_REQUESTED]: Record<string, never>;
    [GameEventType.GAME_STATE_LOADED]: GameSnapshot;
    [GameEventType.LARGEST_ARMY_CHANGED]: { playerId: string };
    [GameEventType.LONGEST_ROAD_CHANGED]: { playerId: string };
    [GameEventType.PANEL_CLOSED]: { panel: 'trade' | 'build' | 'dev-cards' };
    [GameEventType.PANEL_OPENED]: { panel: 'trade' | 'build' | 'dev-cards' };
    [GameEventType.PLAYER_DISCONNECTED]: { playerId: string };
    [GameEventType.PLAYER_JOINED]: { playerId: string; name: string };
    [GameEventType.RESOURCES_GRANTED]: { playerId: string; resources: Resource[] };
    [GameEventType.OPPONENT_CARD_COUNT_CHANGED]: { playerId: string; cardCount: number };
    [GameEventType.RESOURCES_SPENT]: { playerId: string; amount: number };
    [GameEventType.TOAST_REQUESTED]: { message: string; kind: 'error' | 'info' | 'success' };
    [GameEventType.TURN_ENDED]: { playerId: string };
    [GameEventType.TURN_STARTED]: { playerId: string };
    [GameEventType.VICTORY_POINTS_CHANGED]: { playerId: string; points: number };
    [GameEventType.GAME_STARTED]: { players: PlayerSnapshot[] };
    [GameEventType.DISCARD_REQUIRED]: { playerId: string, amount: number };
    [GameEventType.DISCARD_CONFIRMED]: { playerId: string, resources: Resource[] };
    [GameEventType.CARDS_DISCARDED]: { playerId: string, resources: Resource[] };
    [GameEventType.ROBBER_PLACED]: { playerId: string, hex: Hex };
    [GameEventType.ROBBER_STEAL_COMPLETE]: { playerId: string, resources: Resource[] };
    [GameEventType.SETUP_TURN_COMPLETED]: { playerId: string };
    [GameEventType.PHASE_ADVANCED]: { phase: GamePhase };
    [GameEventType.GAME_ENDED]: Record<string, never>;
    [GameEventType.TRADE_STARTED]: { initialSelection: string } //The uid of the card to offer.
    [GameEventType.TRADE_ENDED]: Record<string, never>;
    [GameEventType.TRADE_CANCELLED]: void;
    [GameEventType.TRADE_CONFIRM_BANK_SENT_TO_SERVER]: { playerId: string, offered: Resource[], wanted: Resource[] };
    [GameEventType.TRADE_CONFIRM_GLOBAL_SENT_TO_SERVER]: { playerId: string, offered: Resource[], wanted: Resource[] };
    [GameEventType.TRADE_OFFER_INCOME_RECIEVED]: TradeOfferPanelData;
    [GameEventType.TRADE_OFFER_OUTGOING_RECIEVED]: TradeOfferPanelData;
    [GameEventType.TRADE_OFFER_CANCELLED]: { tradeOfferId: string, };
    [GameEventType.TRADE_OFFER_ACCEPTED]: { playerId: string, tradeOfferId: string };
    [GameEventType.TRADE_OFFER_ACCEPTED_SENT_TO_SERVER]: { playerId: string, tradeOfferId: string };
    [GameEventType.TRADE_OFFER_DECLINED]: { playerId: string, tradeOfferId: string };
    [GameEventType.TRADE_OFFER_DECLINED_SENT_TO_SERVER]: { playerId: string, tradeOfferId: string };
}

export interface GameEvent<T extends GameEventType = GameEventType> {
    type: T;
    payload: EventPayloads[T];
    source: GameEventSource;
}