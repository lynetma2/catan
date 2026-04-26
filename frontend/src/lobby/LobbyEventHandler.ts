import type {
    GameInitializedEvent,
    GameStartRejectedEvent,
    InboundLobbyEvent,
    LobbyCreatedEvent,
    LobbyJoinRejectedEvent,
    LobbyNotFoundError,
    LobbyStateEvent,
    PlayerDisconnectedEvent,
    PlayerJoinedLobbyEvent,
    PlayerReadyEvent,
    PlayerUnreadyEvent
} from "@/lobby/LobbyEvents.ts";

type InboundLobbyEventMap = {
    'LOBBY_CREATED':       LobbyCreatedEvent;
    'PLAYER_JOINED_LOBBY': PlayerJoinedLobbyEvent;
    'PLAYER_READY':        PlayerReadyEvent;
    'PLAYER_UNREADY':      PlayerUnreadyEvent;
    'PLAYER_DISCONNECTED': PlayerDisconnectedEvent;
    'GAME_INITIALIZED':    GameInitializedEvent;
    'LOBBY_JOIN_REJECTED': LobbyJoinRejectedEvent;
    'GAME_START_REJECTED': GameStartRejectedEvent;
    'LOBBY_NOT_FOUND':     LobbyNotFoundError;
    'LOBBY_STATE': LobbyStateEvent;
};

type PartialEventHandlers = {
    [K in keyof InboundLobbyEventMap]?: (event: InboundLobbyEventMap[K]) => void;
};

export function handleLobbyEvent(event: InboundLobbyEvent, handlers: PartialEventHandlers) {
    const handler = handlers[event.type as keyof InboundLobbyEventMap];
    if (handler) {
        // TypeScript can't narrow this automatically across the map lookup,
        // so we cast here — but the map guarantees it's correct
        (handler as (e: InboundLobbyEvent) => void)(event);
    }
}