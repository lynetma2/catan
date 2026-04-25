package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import java.util.UUID;

public record LobbyCreateRequestedEvent(
        UUID playerId,
        String playerName
) implements InboundLobbyEvent {
    @Override
    public InboundLobbyEventType type() {
        return InboundLobbyEventType.LOBBY_CREATE_REQUESTED;
    }
}