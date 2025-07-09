package com.sundtrack.catan.messaging.Events;

public class PutSettlement extends GameEvent {

    public PutSettlement(int player, int id) {
        super(EventKind.PUTSETTLEMENT, player, id);
    }

    //TODO add methods to handle the event happening.


}
