package com.sundtrack.catan.game.Events;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.Player;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

public class RollDice extends GameEvent{

    public RollDice(String player, int id) {
        super(EventKind.ROLLDICE, player, id);
    }

    @Override
    public void doEvent(Game game) {
        int[] dices = new int[2];
        dices[0] = ThreadLocalRandom.current().nextInt(1, 6 + 1);
        dices[1] = ThreadLocalRandom.current().nextInt(1, 6 + 1);

        game.setDices(dices);

        //Handle the gathering of resources!
        Map<String, Integer[]> resources = game.getBoard().resourceIncrement(dices, game.getPlayers());

        //Calculate total for each resource
        Integer[] totalDraw = new Integer[5];
        resources.forEach((playerName, resource) -> {
            for(int i = 0; i < resource.length;i++) {
                totalDraw[i] += resource[i];
            }
        });

        //Check if it's too high and then reset that resource income for all.
        for (int i = 0; i < totalDraw.length;i++) {
            if (game.getResources()[i] - totalDraw[i] < 0) {
                int finalI = i;
                resources.forEach((playerName, resource) -> {
                    resource[finalI] = 0;
                });
            }
        }

        resources.forEach((playerName, resource) -> {
            Player player = game.getPlayers().get(playerName);
            Player.batchAddResources(player.getResources(), resource);
            Player.batchRemoveResources(game.getResources(), resource);
        });
    }

    //TODO add methods to handle the event happening.


}
