// --- Outbound ---
import type {GameSnapshot} from "@/game/core/types.ts";

export type LobbyCreateRequestedEvent = { type: 'LOBBY_CREATE_REQUESTED'; playerName: string; };
export type LobbyJoinRequestedEvent = { type: 'LOBBY_JOIN_REQUESTED'; playerName: string; };
export type PlayerReadyRequestedEvent = { type: 'PLAYER_READY_REQUESTED' };
export type PlayerUnreadyRequestedEvent = { type: 'PLAYER_UNREADY_REQUESTED' };
export type GameStartRequestedEvent = { type: 'GAME_START_REQUESTED' };

export type OutboundLobbyEvent =
    | LobbyCreateRequestedEvent
    | LobbyJoinRequestedEvent
    | PlayerReadyRequestedEvent
    | PlayerUnreadyRequestedEvent
    | GameStartRequestedEvent;

// --- Inbound ---
export type LobbyCreatedEvent =       { type: 'LOBBY_CREATED';       lobbyId: string; playerId: string; playerName: string; };
export type PlayerJoinedLobbyEvent =  { type: 'PLAYER_JOINED_LOBBY'; lobbyId: string; playerId: string; playerName: string; isLeader: boolean; };
export type PlayerReadyEvent =        { type: 'PLAYER_READY';        playerId: string; };
export type PlayerUnreadyEvent =      { type: 'PLAYER_UNREADY';      playerId: string; };
export type PlayerDisconnectedEvent = { type: 'PLAYER_DISCONNECTED'; playerId: string; };
export type GameInitializedEvent =    { type: 'GAME_INITIALIZED' };
export type LobbyJoinRejectedEvent =  { type: 'LOBBY_JOIN_REJECTED'; reason: string; };
export type GameStartRejectedEvent =  { type: 'GAME_START_REJECTED'; reason: string; };
export type LobbyNotFoundError =      { type: 'LOBBY_NOT_FOUND';     lobbyId: string; };
export type LobbyStateEvent = {
    type: 'LOBBY_STATE';
    lobbyId: string;
    localPlayerId: string;
    snapshot: {
        players: Array<{
            playerId: string;
            username: string;
            isReady: boolean;
            isLeader: boolean;
        }>;
    };
};

export type InboundLobbyEvent =
    | LobbyCreatedEvent
    | PlayerJoinedLobbyEvent
    | PlayerReadyEvent
    | PlayerUnreadyEvent
    | PlayerDisconnectedEvent
    | GameInitializedEvent
    | LobbyJoinRejectedEvent
    | GameStartRejectedEvent
    | LobbyNotFoundError
    | LobbyStateEvent;