package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

public enum InboundLobbyEventType {
    LOBBY_CREATE_REQUESTED(LobbyCreateRequestedEvent.class),
    LOBBY_JOIN_REQUESTED(LobbyJoinRequestedEvent.class),
    PLAYER_READY_REQUESTED(PlayerReadyRequestedEvent.class),
    PLAYER_UNREADY_REQUESTED(PlayerUnreadyRequestedEvent.class),
    GAME_START_REQUESTED(GameStartRequestedEvent.class),
    LOBBY_RECONNECT_REQUESTED(LobbyReconnectRequestedEvent.class);

    public final Class<? extends InboundLobbyEvent> eventClass;

    InboundLobbyEventType(Class<? extends InboundLobbyEvent> eventClass) {
        this.eventClass = eventClass;
    }
}
