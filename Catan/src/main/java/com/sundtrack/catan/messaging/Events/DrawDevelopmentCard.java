package com.sundtrack.catan.messaging.Events;

public class DrawDevelopmentCard extends GameEvent{

    public DrawDevelopmentCard(int player) {
        super(EventKind.DRAWDEVELOPMENTCARD, player);
    }

    //TODO add methods to handle the event happening.


}
