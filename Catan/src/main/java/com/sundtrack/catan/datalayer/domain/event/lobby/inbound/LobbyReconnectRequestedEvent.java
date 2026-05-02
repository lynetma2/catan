package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

import java.util.UUID;

public record LobbyReconnectRequestedEvent(
        UUID lobbyId
) implements InboundLobbyEvent {
    @Override public InboundLobbyEventType type() {
        return InboundLobbyEventType.LOBBY_RECONNECT_REQUESTED;
    }
}
