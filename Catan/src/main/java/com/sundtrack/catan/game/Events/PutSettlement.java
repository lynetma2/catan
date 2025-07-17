package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Building;
import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.game.entity.coordinates.VertexCoordinates;

public class PutSettlement extends GameEvent {

    private final VertexCoordinates coordinates;

    public PutSettlement(String player, int id, VertexCoordinates coordinates) {
        super(EventKind.PUTSETTLEMENT, player, id);
        this.coordinates = coordinates;
    }

    @Override
    public void doEvent(Game game) {
        //Check that the user has enough resources for this action
        String playerName = super.getPlayer();
        Integer[] requiredResources = new Integer[]{1,1,1,1,0};
        Integer[] resources = game.getPlayers().get(playerName).getResources();

        //TODO add try-catch clauses in the codebase
        try {
            Player.batchRemoveResources(resources, requiredResources);
            game.getBoard().addBuilding(new Building(coordinates, Building.Kind.SETTLEMENT, playerName));
            Player.batchAddResources(game.getResources(), requiredResources);
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }

    }

    //TODO add methods to handle the event happening.


}
