package com.sundtrack.catan.messaging.Events;

public class PutSettlement extends GameEvent {

    public PutSettlement(int player) {
        super(EventKind.PUTSETTLEMENT, player);
    }

    //TODO add methods to handle the event happening.


}
