package com.sundtrack.catan.datalayer.domain.event.lobby.action;


import com.sundtrack.catan.datalayer.domain.event.ClientAction;

public record LobbyJoinAction(
        String playerName
) implements LobbyClientAction {

    @Override
    public String action() {
        return "join";
    }
}