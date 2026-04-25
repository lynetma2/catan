package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

import java.util.UUID;

public sealed interface InboundLobbyEvent extends LobbyEvent permits
        LobbyCreateRequestedEvent,
        LobbyJoinRequestedEvent,
        PlayerReadyRequestedEvent,
        PlayerUnreadyRequestedEvent,
        GameStartRequestedEvent {

    InboundLobbyEventType type();
    UUID playerId();
}