package com.sundtrack.catan.datalayer.domain.event.inbound;

import com.sundtrack.catan.datalayer.domain.event.GameEvent;

import java.util.UUID;

public sealed interface InboundGameEvent extends GameEvent permits
        GameStartRequestedEvent {

    InboundGameEventType type();
    UUID playerId();
}
