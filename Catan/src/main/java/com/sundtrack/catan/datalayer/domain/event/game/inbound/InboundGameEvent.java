package com.sundtrack.catan.datalayer.domain.event.game.inbound;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import com.sundtrack.catan.datalayer.domain.event.game.GameEvent;

@JsonTypeInfo(use = JsonTypeInfo.Id.CUSTOM, property = "type")
@JsonTypeIdResolver(InboundGameEventTypeResolver.class)
public sealed interface InboundGameEvent extends GameEvent permits GameStartRequestedEvent, GameStateRequestedEvent {
    InboundGameEventType type();
}
