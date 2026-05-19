package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.GameStartRejectionReason;

@JsonTypeName("server.game.start.rejected")
public record GameStartRejectedEvent(
        GameStartRejectionReason reason
) implements LobbyServerEvent {}

