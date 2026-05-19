package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;

public record GameInitializedEvent(
) implements OutboundLobbyEvent {
    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.GAME_INITIALIZED;
    }
}
