package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import java.util.UUID;

public record LobbyCreatedEvent(
        UUID lobbyId,
        UUID playerId,
        String playerName
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_CREATED;
    }
}
