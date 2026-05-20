package com.sundtrack.catan.datalayer.domain.event.lobby.action;

public record PlayerReadyAction(
) implements LobbyClientAction {
    @Override
    public String action() {
        return "player.ready";
    }
}

