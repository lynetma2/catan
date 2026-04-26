import type {
    GameInitializedEvent, GameStartRejectedEvent,
    LobbyCreatedEvent, LobbyJoinRejectedEvent, LobbyNotFoundError, OutboundLobbyEvent, PlayerDisconnectedEvent,
    PlayerJoinedLobbyEvent,
    PlayerReadyEvent,
    PlayerUnreadyEvent
} from "@/lobby/LobbyEvents.ts";

type OutboundLobbyEventMap = {
    'LOBBY_CREATED':       LobbyCreatedEvent;
    'PLAYER_JOINED_LOBBY': PlayerJoinedLobbyEvent;
    'PLAYER_READY':        PlayerReadyEvent;
    'PLAYER_UNREADY':      PlayerUnreadyEvent;
    'PLAYER_DISCONNECTED': PlayerDisconnectedEvent;
    'GAME_INITIALIZED':    GameInitializedEvent;
    'LOBBY_JOIN_REJECTED': LobbyJoinRejectedEvent;
    'GAME_START_REJECTED': GameStartRejectedEvent;
    'LOBBY_NOT_FOUND':     LobbyNotFoundError;
};

type PartialEventHandlers = {
    [K in keyof OutboundLobbyEventMap]?: (event: OutboundLobbyEventMap[K]) => void;
};

export function handleLobbyEvent(event: OutboundLobbyEvent, handlers: PartialEventHandlers) {
    const handler = handlers[event.type as keyof OutboundLobbyEventMap];
    if (handler) {
        // TypeScript can't narrow this automatically across the map lookup,
        // so we cast here — but the map guarantees it's correct
        (handler as (e: OutboundLobbyEvent) => void)(event);
    }
}