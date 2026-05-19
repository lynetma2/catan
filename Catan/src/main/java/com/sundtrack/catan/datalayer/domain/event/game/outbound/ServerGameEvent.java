package com.sundtrack.catan.datalayer.domain.event.game.outbound;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

public sealed interface ServerGameEvent extends ServerEvent permits BuildPlacedEvent, GameStateEvent {

    @JsonProperty("type")
    OutboundGameEventType type();
}
