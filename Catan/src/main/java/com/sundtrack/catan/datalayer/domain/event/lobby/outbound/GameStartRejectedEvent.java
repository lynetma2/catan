package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

public record GameStartRejectedEvent(
        GameStartRejectionReason reason
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.GAME_START_REJECTED;
    }
}

