package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum OutboundLobbyEventType {
    LOBBY_CREATED,
    LOBBY_STATE,
    PLAYER_JOINED_LOBBY,
    PLAYER_READY,
    PLAYER_UNREADY,
    PLAYER_DISCONNECTED,
    GAME_INITIALIZED,

    // Rejections
    LOBBY_JOIN_REJECTED,
    GAME_START_REJECTED,
    LOBBY_NOT_FOUND,
    LOBBY_RECONNECT_REJECTED,
}
