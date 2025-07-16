package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;

public class DrawDevelopmentCard extends GameEvent {

    public DrawDevelopmentCard(String player, int id) {
        super(EventKind.DRAWDEVELOPMENTCARD, player, id);
    }

    @Override
    public void doEvent(Game game) {

        //
    }

    //TODO add methods to handle the event happening.


}
