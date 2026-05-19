package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.UUID;

@JsonTypeName("action.lobby.reconnect")
public record LobbyReconnectAction(
        UUID lobbyId
) implements LobbyClientAction {}
