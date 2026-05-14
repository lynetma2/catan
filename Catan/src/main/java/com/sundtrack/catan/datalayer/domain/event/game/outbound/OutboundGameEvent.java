package com.sundtrack.catan.datalayer.domain.event.game.outbound;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;

public sealed interface OutboundGameEvent extends OutboundEvent permits BuildPlacedEvent, GameStateEvent {

    @JsonProperty("type")
    OutboundGameEventType type();
}
