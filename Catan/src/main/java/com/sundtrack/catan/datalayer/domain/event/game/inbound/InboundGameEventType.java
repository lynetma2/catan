package com.sundtrack.catan.datalayer.domain.event.game.inbound;

public enum InboundGameEventType {
    GAME_START_REQUESTED(GameStartRequestedEvent.class),
    REQUEST_GAME_STATE(GameStateRequestedEvent.class);

    public final Class<? extends InboundGameEvent> eventClass;

    private InboundGameEventType(Class<? extends InboundGameEvent> eventClass) {
        this.eventClass = eventClass;
    }
}
