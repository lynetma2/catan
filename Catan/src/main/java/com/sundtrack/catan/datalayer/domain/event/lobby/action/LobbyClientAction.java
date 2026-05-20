package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;

public sealed interface LobbyClientAction extends ClientAction
    permits
        GameStartAction,
        LobbyCreateAction,
        LobbyJoinAction,
        LobbyReconnectAction,
        PlayerReadyAction,
        PlayerUnreadyAction {

    @Override
    default String domain() {
        return "lobby";
    }
}
