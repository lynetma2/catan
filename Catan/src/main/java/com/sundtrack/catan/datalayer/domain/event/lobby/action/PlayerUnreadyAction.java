package com.sundtrack.catan.datalayer.domain.event.lobby.action;

public record PlayerUnreadyAction(
) implements LobbyClientAction {
    @Override
    public String action() {
        return "player.unready";
    }
}
