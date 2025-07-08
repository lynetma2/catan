package com.sundtrack.catan.messaging.Events;

public class MoveRobber extends GameEvent{

    public MoveRobber(int player) {
        super(EventKind.MOVEROBBER, player);
    }

    //TODO add methods to handle the event happening.


}
