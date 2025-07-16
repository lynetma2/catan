package com.sundtrack.catan.game.Events;

public class UseDevelopmentCard extends GameEvent{
    private GameEvent.EventKind kind;

    public UseDevelopmentCard(int player, int id) {
        super(EventKind.USEDEVELOPMENTCARD, player, id);
    }

    //TODO add methods to handle the event happening.


}
