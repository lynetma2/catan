package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("action.lobby.player.unready")
public record PlayerUnreadyAction(
) implements LobbyClientAction {}
