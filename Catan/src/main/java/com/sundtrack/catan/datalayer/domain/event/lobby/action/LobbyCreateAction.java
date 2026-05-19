package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("action.lobby.create")
public record LobbyCreateAction(
        String playerName
) implements LobbyClientAction { }