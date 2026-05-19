package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("action.game.start")
public record GameStartAction() implements LobbyClientAction { }
