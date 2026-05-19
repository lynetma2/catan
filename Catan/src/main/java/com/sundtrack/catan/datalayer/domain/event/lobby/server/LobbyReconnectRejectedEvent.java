package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyReconnectRejectionReason;

@JsonTypeName("server.lobby.reconnect.rejected")
public record LobbyReconnectRejectedEvent(
        LobbyReconnectRejectionReason reason
) implements LobbyServerEvent {}