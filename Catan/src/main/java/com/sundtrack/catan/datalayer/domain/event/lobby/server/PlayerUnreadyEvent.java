package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import java.util.UUID;

public record PlayerUnreadyEvent(
        UUID playerId
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "player.unready";
    }
}
