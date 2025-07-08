package com.sundtrack.catan.messaging.Events;

public class UseDevelopmentCard extends GameEvent{
    private GameEvent.EventKind kind;

    public UseDevelopmentCard(int player) {
        super(EventKind.USEDEVELOPMENTCARD, player);
    }

    //TODO add methods to handle the event happening.


}
