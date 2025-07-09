package com.sundtrack.catan.messaging.Events;

public class MoveRobber extends GameEvent{

    public MoveRobber(int player, int id) {
        super(EventKind.MOVEROBBER, player, id);
    }

    //TODO add methods to handle the event happening.


}
