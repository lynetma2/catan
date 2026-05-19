package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyReconnectRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;

public record LobbyReconnectRejectedEvent(
        LobbyReconnectRejectionReason reason
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_RECONNECT_REJECTED;
    }
}