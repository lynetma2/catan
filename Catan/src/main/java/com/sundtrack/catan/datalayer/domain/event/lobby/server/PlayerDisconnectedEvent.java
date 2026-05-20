package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import java.util.UUID;

public record PlayerDisconnectedEvent(
        UUID playerId
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "player.disconnected";
    }
}