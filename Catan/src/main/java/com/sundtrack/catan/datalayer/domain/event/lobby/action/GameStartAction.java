package com.sundtrack.catan.datalayer.domain.event.lobby.action;

public record GameStartAction() implements LobbyClientAction {
    @Override
    public String action() {
        return "start";
    }
}
