package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;

public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "join.rejected";
    }
}

