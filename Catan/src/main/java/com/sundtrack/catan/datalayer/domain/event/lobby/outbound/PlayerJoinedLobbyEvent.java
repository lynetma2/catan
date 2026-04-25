package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import java.util.UUID;

public record PlayerJoinedLobbyEvent(
        UUID playerId,
        String playerName
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.PLAYER_JOINED_LOBBY;
    }
}
