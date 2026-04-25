package com.sundtrack.catan.datalayer.domain.event.game.inbound;

import java.util.UUID;

public sealed interface InboundGameEvent permits
        GameStartRequestedEvent {

    InboundGameEventType type();
    UUID playerId();
}
