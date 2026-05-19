package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;

import java.util.UUID;

public record PlayerUnreadyEvent(
        UUID playerId
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.PLAYER_UNREADY;
    }
}
