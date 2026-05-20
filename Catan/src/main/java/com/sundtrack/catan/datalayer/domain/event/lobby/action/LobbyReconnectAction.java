package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import java.util.UUID;

public record LobbyReconnectAction(
        UUID lobbyId
) implements LobbyClientAction {
    @Override
    public String action() {
        return "reconnect";
    }
}
