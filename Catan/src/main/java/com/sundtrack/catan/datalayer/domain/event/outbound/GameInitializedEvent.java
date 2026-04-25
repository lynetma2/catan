package com.sundtrack.catan.datalayer.domain.event.outbound;

public record GameInitializedEvent() implements OutboundGameEvent {
    @Override
    public OutboundGameEventType type() {
        return OutboundGameEventType.GAME_INITIALIZED;
    }
}
