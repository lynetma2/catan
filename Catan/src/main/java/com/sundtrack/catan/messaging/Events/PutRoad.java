package com.sundtrack.catan.messaging.Events;

public class PutRoad extends GameEvent{

    public PutRoad(int player, int id) {
        super(EventKind.PUTROAD, player, id);
    }

    //TODO add methods to handle the event happening.


}
