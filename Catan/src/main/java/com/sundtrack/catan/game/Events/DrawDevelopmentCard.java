package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.game.entity.cards.DevelopmentCard;

public class DrawDevelopmentCard extends GameEvent {

    public DrawDevelopmentCard(String player, int id) {
        super(EventKind.DRAWDEVELOPMENTCARD, player, id);
    }

    @Override
    public void doEvent(Game game) {

        //Check that the user has enough resources for this action
        String playerName = super.getPlayer();
        Integer[] requiredResources = new Integer[]{0,0,1,1,1};
        Integer[] resources = game.getPlayers().get(playerName).getResources();

        //TODO add try-catch clauses in the codebase
        try {
            Player.batchRemoveResources(resources, requiredResources);
            DevelopmentCard card = game.getDevelopmentCards().getLast();
            game.getDevelopmentCards().removeLast();

            game.getPlayers().get(playerName).getDevelopmentCards().add(card);

            Player.batchAddResources(game.getResources(), requiredResources);
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }

    }

    //TODO add methods to handle the event happening.


}
