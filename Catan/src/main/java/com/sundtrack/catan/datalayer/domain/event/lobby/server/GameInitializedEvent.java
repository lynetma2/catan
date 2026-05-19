package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("server.game.initialized")
public record GameInitializedEvent(
) implements LobbyServerEvent {}
