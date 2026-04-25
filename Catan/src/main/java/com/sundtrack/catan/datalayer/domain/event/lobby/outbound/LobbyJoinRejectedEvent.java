package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_JOIN_REJECTED;
    }
}

