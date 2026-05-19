package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("action.lobby.player.ready")
public record PlayerReadyAction(
) implements LobbyClientAction {}

