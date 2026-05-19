package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEventType;

import java.util.UUID;

public record LobbyReconnectAction(
        UUID lobbyId
) implements InboundLobbyEvent {
    @Override public InboundLobbyEventType type() {
        return InboundLobbyEventType.LOBBY_RECONNECT_REQUESTED;
    }
}
