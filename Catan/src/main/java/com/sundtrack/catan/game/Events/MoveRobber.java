package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;

public class MoveRobber extends GameEvent {

    private final HexCoordinates coordinates;

    public MoveRobber(String player, int id, HexCoordinates coordinates) {
        super(EventKind.MOVEROBBER, player, id);
        this.coordinates = coordinates;
    }

    //TODO add methods to handle the event happening.
    @Override
    public void doEvent(Game game) {
        //Check that the field is legal
        game.getBoard().moveRobber(coordinates);
    }
}
