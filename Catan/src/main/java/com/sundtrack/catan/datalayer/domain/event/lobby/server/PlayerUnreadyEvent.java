package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;
import java.util.UUID;

@JsonTypeName("server.lobby.player.unready")
public record PlayerUnreadyEvent(
        UUID playerId
) implements LobbyServerEvent {}
