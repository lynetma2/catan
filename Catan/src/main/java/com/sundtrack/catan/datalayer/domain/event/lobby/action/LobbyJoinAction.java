package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("action.lobby.join")
public record LobbyJoinAction(
        String playerName
) implements LobbyClientAction { }
