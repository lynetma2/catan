package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

public sealed interface LobbyServerEvent extends ServerEvent
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

    @Override
    default String domain() {
        return "lobby";
    }
}