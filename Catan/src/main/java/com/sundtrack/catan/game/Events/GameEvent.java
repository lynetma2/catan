package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.Hex;
import com.sundtrack.catan.game.entity.Road;
import com.sundtrack.catan.game.entity.Building;

public abstract class GameEvent {

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
    private final String player;
    private final int id;
//    private final Hex hex;
//    private final Road road;
//    private final Building vertex;
    //TODO add some fields to handle trade and developmentcard.

    public GameEvent(EventKind kind, String player, int id) {
        this.kind = kind;
        this.player = player;
        this.id = id;
//        this.hex = hex;
//        this.road = road;
//        this.vertex = vertex;
    }

    public String getPlayer() {
        return player;
    }

    public EventKind getKind() {
        return kind;
    }

    public int getId() {
        return id;
    }

    public abstract void doEvent(Game game);
}
