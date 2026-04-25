package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

public enum LobbyJoinRejectionReason {
    LOBBY_FULL,
    GAME_ALREADY_STARTED,
    ALREADY_IN_LOBBY,
}
