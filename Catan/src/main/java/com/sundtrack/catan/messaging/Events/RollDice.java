package com.sundtrack.catan.messaging.Events;

public class RollDice extends GameEvent{

    public RollDice(int player, int id) {
        super(EventKind.ROLLDICE, player, id);
    }

    //TODO add methods to handle the event happening.


}
