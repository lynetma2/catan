package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;

@JsonTypeName("server.lobby.join.rejected")
public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements LobbyServerEvent {}

