package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.UUID;

@JsonTypeName("server.lobby.player.ready")
public record PlayerReadyEvent(
        UUID playerId
) implements LobbyServerEvent {}

