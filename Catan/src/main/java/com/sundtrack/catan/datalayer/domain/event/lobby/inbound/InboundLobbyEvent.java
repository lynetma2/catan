package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonTypeIdResolver;
import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.CUSTOM, property = "type")
@JsonTypeIdResolver(InboundLobbyEventTypeResolver.class)
public sealed interface InboundLobbyEvent extends LobbyEvent permits GameStartRequestedEvent, LobbyCreateRequestedEvent, LobbyJoinRequestedEvent, LobbyReconnectRequestedEvent, PlayerReadyRequestedEvent, PlayerUnreadyRequestedEvent {
    @JsonIgnore
    InboundLobbyEventType type();
}