package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyReconnectRejectionReason;

public record LobbyReconnectRejectedEvent(
        LobbyReconnectRejectionReason reason
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "reconnect.rejected";
    }
}