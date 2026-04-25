package com.sundtrack.catan.datalayer.domain.event.inbound;

import java.util.UUID;

public record GameStartRequestedEvent(UUID playerId) implements InboundGameEvent{
    @Override
    public InboundGameEventType type() {
        return InboundGameEventType.GAME_START_REQUESTED;
    }

    @Override
    public UUID playerId() {
        return playerId;
    }
}
