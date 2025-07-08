package com.sundtrack.catan.messaging.Events;

public class RollDice extends GameEvent{

    public RollDice(int player) {
        super(EventKind.ROLLDICE, player);
    }

    //TODO add methods to handle the event happening.


}
