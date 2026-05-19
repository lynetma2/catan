package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;

public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_JOIN_REJECTED;
    }
}

