package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import java.util.UUID;

public record PlayerJoinedEvent(
        UUID playerId,
        String playerName
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "player.joined";
    }
}
