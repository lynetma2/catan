package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

public sealed interface LobbyClientAction extends LobbyEvent
    permits
        GameStartAction,
        LobbyCreateAction,
        LobbyJoinAction,
        LobbyReconnectAction,
        PlayerReadyAction,
        PlayerUnreadyAction {
}
