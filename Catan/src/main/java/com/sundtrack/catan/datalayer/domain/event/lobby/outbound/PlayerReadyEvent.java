package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import java.util.UUID;

public record PlayerReadyEvent(
        UUID playerId
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.PLAYER_READY;
    }
}

