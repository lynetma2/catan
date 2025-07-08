package com.sundtrack.catan.messaging.Events;

public class GameEvent {
    enum EventKind {
        ROLLDICE,
        PUTSETTLEMENT,
        PUTROAD,
        PUTCITY,
        MOVEROBBER,
        USEDEVELOPMENTCARD,
        DRAWDEVELOPMENTCARD,
        TRADE,
    }

    private EventKind kind;
    private int player;

    public GameEvent(EventKind kind, int player) {
        this.kind = kind;
        this.player = player;
    }

}
