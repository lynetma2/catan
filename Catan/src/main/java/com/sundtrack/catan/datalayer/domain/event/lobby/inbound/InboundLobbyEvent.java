package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

import java.util.UUID;

public sealed interface InboundLobbyEvent extends LobbyEvent permits GameStartRequestedEvent, LobbyCreateRequestedEvent, LobbyJoinRequestedEvent, LobbyReconnectRequestedEvent, PlayerReadyRequestedEvent, PlayerUnreadyRequestedEvent {

    InboundLobbyEventType type();
    UUID playerId();
}