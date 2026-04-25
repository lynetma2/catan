package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.LobbyEvent;

public sealed interface OutboundLobbyEvent extends OutboundEvent permits
        GameInitializedEvent,
        PlayerDisconnectedEvent,
        PlayerUnreadyEvent,
        GameStartRejectedEvent,
        LobbyCreatedEvent,
        LobbyJoinRejectedEvent,
        LobbyNotFoundError,
        LobbyStateEvent,
        PlayerJoinedLobbyEvent,
        PlayerReadyEvent {
    OutboundLobbyEventType type();
}


