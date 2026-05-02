package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import java.util.UUID;

public record PlayerReadyRequestedEvent(
) implements InboundLobbyEvent {
    @Override public InboundLobbyEventType type() {
        return InboundLobbyEventType.PLAYER_READY_REQUESTED;
    }
}

