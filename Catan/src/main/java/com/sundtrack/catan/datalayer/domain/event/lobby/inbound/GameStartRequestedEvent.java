package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import java.util.UUID;

public record GameStartRequestedEvent(UUID playerId) implements InboundLobbyEvent {
    @Override
    public InboundLobbyEventType type() {
        return InboundLobbyEventType.GAME_START_REQUESTED;
    }

    @Override
    public UUID playerId() {
        return playerId;
    }
}
