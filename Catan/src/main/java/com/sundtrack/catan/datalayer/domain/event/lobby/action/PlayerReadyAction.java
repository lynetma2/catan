package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEventType;

public record PlayerReadyAction(
) implements InboundLobbyEvent {
    @Override public InboundLobbyEventType type() {
        return InboundLobbyEventType.PLAYER_READY_REQUESTED;
    }
}

