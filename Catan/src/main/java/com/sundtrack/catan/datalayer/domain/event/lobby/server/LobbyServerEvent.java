package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

public sealed interface LobbyServerEvent extends LobbyEvent, ServerEvent
        permits
        GameInitializedEvent,
        GameStartRejectedEvent,
        LobbyJoinRejectedEvent,
        LobbyReconnectRejectedEvent,
        LobbyStateEvent,
        PlayerDisconnectedEvent,
        PlayerJoinedEvent,
        PlayerReadyEvent,
        PlayerUnreadyEvent {
}