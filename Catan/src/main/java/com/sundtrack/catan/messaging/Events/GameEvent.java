package com.sundtrack.catan.messaging.Events;

import com.sundtrack.catan.game.entity.Hex;
import com.sundtrack.catan.game.entity.Road;
import com.sundtrack.catan.game.entity.Building;

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
    private final Hex hex;
    private final Road road;
    private final Building vertex;
    //TODO add some fields to handle trade and developmentcard.

    public GameEvent(EventKind kind, int player, int id, Hex hex, Road road,  Building vertex) {
        this.kind = kind;
        this.player = player;
        this.id = id;
        this.hex = hex;
        this.road = road;
        this.vertex = vertex;
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
