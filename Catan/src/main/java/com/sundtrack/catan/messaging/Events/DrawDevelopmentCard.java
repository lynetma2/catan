package com.sundtrack.catan.messaging.Events;

public class DrawDevelopmentCard extends GameEvent{

    public DrawDevelopmentCard(int player, int id) {
        super(EventKind.DRAWDEVELOPMENTCARD, player, id);
    }

    //TODO add methods to handle the event happening.


}
