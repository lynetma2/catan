package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

public enum InboundLobbyEventType {
    LOBBY_CREATE_REQUESTED,
    LOBBY_JOIN_REQUESTED,
    PLAYER_READY_REQUESTED,
    PLAYER_UNREADY_REQUESTED,
    GAME_START_REQUESTED,
    LOBBY_RECONNECT_REQUESTED
}
