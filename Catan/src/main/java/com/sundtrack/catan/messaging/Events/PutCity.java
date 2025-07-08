package com.sundtrack.catan.messaging.Events;

public class PutCity extends GameEvent{

    public PutCity(int player) {
        super(EventKind.PUTCITY, player);
    }

    //TODO add methods to handle the event happening.


}
