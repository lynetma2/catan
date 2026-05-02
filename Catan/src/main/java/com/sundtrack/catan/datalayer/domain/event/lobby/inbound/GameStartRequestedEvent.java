package com.sundtrack.catan.datalayer.domain.event.lobby.inbound;

public record GameStartRequestedEvent() implements InboundLobbyEvent {
    @Override
    public InboundLobbyEventType type() {
        return InboundLobbyEventType.GAME_START_REQUESTED;
    }
}
