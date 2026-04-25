package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

public enum GameStartRejectionReason {
    NOT_LEADER,
    PLAYERS_NOT_READY,
    NOT_ENOUGH_PLAYERS,
}
