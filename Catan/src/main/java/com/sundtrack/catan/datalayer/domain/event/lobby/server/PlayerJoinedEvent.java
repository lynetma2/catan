package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;

import java.util.UUID;

public record PlayerJoinedEvent(
        UUID playerId,
        String playerName
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.PLAYER_JOINED_LOBBY;
    }
}
