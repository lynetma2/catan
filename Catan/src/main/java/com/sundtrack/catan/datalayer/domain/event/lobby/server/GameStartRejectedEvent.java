package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.reason.GameStartRejectionReason;

public record GameStartRejectedEvent(
        GameStartRejectionReason reason
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "start.rejected";
    }
}

