package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.game.entity.Road;
import com.sundtrack.catan.game.entity.coordinates.EdgeCoordinates;

public class PutRoad extends GameEvent{

    private final EdgeCoordinates coordinates;

    public PutRoad(String playerName, int id, EdgeCoordinates coordinates) {
        super(EventKind.PUTROAD, playerName, id);
        this.coordinates = coordinates;
    }

    @Override
    public void doEvent(Game game) {
        //Check that the user has enough resources for this action
        String playerName = super.getPlayer();
        Integer[] requiredResources = new Integer[]{1,1,0,0,0};
        Integer[] resources = game.getPlayers().get(playerName).getResources();

        //TODO add try-catch clauses in the codebase
        try {
            Player.batchRemoveResources(resources, requiredResources);
            game.getBoard().addRoad(new Road(coordinates, playerName));
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }
    }

    //TODO add methods to handle the event happening.


}
