package com.sundtrack.catan.messaging.Events;

public class GameEvent {

    public enum EventKind {
        ROLLDICE,
        PUTSETTLEMENT,
        PUTROAD,
        PUTCITY,
        MOVEROBBER,
        USEDEVELOPMENTCARD,
        DRAWDEVELOPMENTCARD,
        TRADE,
    }

    private final EventKind kind;
    private final int player;
    private final int id;

    public GameEvent(EventKind kind, int player, int id) {
        this.kind = kind;
        this.player = player;
        this.id = id;
    }

    public int getPlayer() {
        return player;
    }

    public EventKind getKind() {
        return kind;
    }

    public int getId() {
        return id;
    }

}
