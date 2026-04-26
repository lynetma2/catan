package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

public record LobbyReconnectRejectionEvent(
        LobbyReconnectRejectionReason reason
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_RECONNECT_REJECTED;
    }
}