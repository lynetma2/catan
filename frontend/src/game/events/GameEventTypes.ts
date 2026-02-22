// events/GameEventTypes.ts

import type {
    BuildTarget,
    PieceType, Resource
} from "@/game/core/types.ts"; // Adjust path as needed

export enum GameEventSource {
    Hud     = 'hud',
    World   = 'world',
    Network = 'network',
    Input   = 'input',
}

export enum BuildRejectionReason {
    NOT_YOUR_TURN            = 'NOT_YOUR_TURN',
    WRONG_PHASE              = 'WRONG_PHASE',
    INSUFFICIENT_RESOURCES   = 'INSUFFICIENT_RESOURCES',
    SPOT_OCCUPIED            = 'SPOT_OCCUPIED',
    NO_ADJACENT_ROAD         = 'NO_ADJACENT_ROAD',
    DISTANCE_RULE_VIOLATED   = 'DISTANCE_RULE_VIOLATED',
    NO_SETTLEMENT_TO_UPGRADE = 'NO_SETTLEMENT_TO_UPGRADE',
}

// 1. Define the Enum as GameEventType
export enum GameEventType {
    BUILD_MODE_ENTERED        = 'BUILD_MODE_ENTERED',
    BUILD_MODE_EXITED         = 'BUILD_MODE_EXITED',
    BUILD_PLACEMENT_REQUESTED = 'BUILD_PLACEMENT_REQUESTED',
    BUILD_PLACED              = 'BUILD_PLACED',
    BUILD_REJECTED            = 'BUILD_REJECTED',
    DRAW_DEVELOPMENT_CARD_REQUESTED = 'DRAW_DEVELOPMENT_CARD_REQUESTED',
    DICE_ROLLED               = 'DICE_ROLLED',
    END_TURN_REQUESTED        = 'END_TURN_REQUESTED',
    GAME_STATE_LOADED         = 'GAME_STATE_LOADED',
    LARGEST_ARMY_CHANGED      = 'LARGEST_ARMY_CHANGED',
    LONGEST_ROAD_CHANGED      = 'LONGEST_ROAD_CHANGED',
    PANEL_CLOSED              = 'PANEL_CLOSED',
    PANEL_OPENED              = 'PANEL_OPENED',
    PLAYER_DISCONNECTED       = 'PLAYER_DISCONNECTED',
    PLAYER_JOINED             = 'PLAYER_JOINED',
    RESOURCES_GRANTED         = 'RESOURCES_GRANTED',
    RESOURCES_SPENT           = 'RESOURCES_SPENT',
    TOAST_REQUESTED           = 'TOAST_REQUESTED',
    TURN_ENDED                = 'TURN_ENDED',
    TURN_STARTED              = 'TURN_STARTED',
    VICTORY_POINTS_CHANGED    = 'VICTORY_POINTS_CHANGED',
    GAME_STARTED              = 'GAME_STARTED',
    OPPONENT_CARD_COUNT_CHANGED = 'OPPONENT_CARD_COUNT_CHANGED',
}

// 2. Map the payloads using the GameEventType enum
export interface EventPayloads {
    [GameEventType.BUILD_MODE_ENTERED]:         { pieceType: PieceType };
    [GameEventType.BUILD_MODE_EXITED]:          Record<string, never>;
    [GameEventType.BUILD_PLACEMENT_REQUESTED]:  { pieceType: PieceType; target: BuildTarget };
    [GameEventType.BUILD_PLACED]:               { pieceType: PieceType; target: BuildTarget; playerId: string };
    [GameEventType.BUILD_REJECTED]:             { pieceType: PieceType; reason: BuildRejectionReason };
    [GameEventType.DICE_ROLLED]:                { values: [number, number]; total: number };
    [GameEventType.DRAW_DEVELOPMENT_CARD_REQUESTED]: { playerId: string };
    [GameEventType.END_TURN_REQUESTED]:         Record<string, never>;
    [GameEventType.GAME_STATE_LOADED]:          { players: PlayerSnapshot[]; placements: PlacementSnapshot; currentPhase: GamePhase; currentPlayerId: string; turnNumber: number };
    [GameEventType.LARGEST_ARMY_CHANGED]:       { playerId: string };
    [GameEventType.LONGEST_ROAD_CHANGED]:       { playerId: string };
    [GameEventType.PANEL_CLOSED]:               { panel: 'trade' | 'build' | 'dev-cards' };
    [GameEventType.PANEL_OPENED]:               { panel: 'trade' | 'build' | 'dev-cards' };
    [GameEventType.PLAYER_DISCONNECTED]:        { playerId: string };
    [GameEventType.PLAYER_JOINED]:              { playerId: string; name: string };
    [GameEventType.RESOURCES_GRANTED]:          { playerId: string; resources: Resource[] };
    [GameEventType.OPPONENT_CARD_COUNT_CHANGED]:{ playerId: string; cardCount: number };
    [GameEventType.RESOURCES_SPENT]:            { playerId: string; amount: number };
    [GameEventType.TOAST_REQUESTED]:            { message: string; kind: 'error' | 'info' | 'success' };
    [GameEventType.TURN_ENDED]:                 { playerId: string };
    [GameEventType.TURN_STARTED]:               { playerId: string };
    [GameEventType.VICTORY_POINTS_CHANGED]:     { playerId: string; points: number };
    [GameEventType.GAME_STARTED]:               { players: PlayerSnapshot[] };
}

export interface GameEvent<T extends GameEventType = GameEventType> {
    type:    T;
    payload: EventPayloads[T];
    source:  GameEventSource;
}