package com.sundtrack.catan.datalayer.domain.event.lobby.action;

public record LobbyCreateAction(
        String playerName
) implements LobbyClientAction {
    @Override
    public String action() {
        return "create";
    }
}