package com.sundtrack.catan.messaging.Events;

public class PutCity extends GameEvent{

    public PutCity(int player, int id) {
        super(EventKind.PUTCITY, player, id);
    }

    //TODO add methods to handle the event happening.


}
