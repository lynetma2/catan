package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.messaging.Events.GameEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Game {

    //Resource array indices
    private final int LUMBER_INDEX = 0;
    private final int BRICK_INDEX = 1;
    private final int GRAIN_INDEX = 2;
    private final int WOOL_INDEX = 3;
    private final int ORE_INDEX = 4;

    private final Board board;
    private final List<Player> players;
    private final int[] dices = new int[] {1,1};
    private final List<GameEvent> events = new ArrayList<>();
    private final int[] resources = new int[] {19,19,19,19,19};
    //TODO add something to log the events, and save them.

    public Game(Board board, List<Player> players) {
        this.board = board;
        this.players = players;
    }

    public Board getBoard() {
        return board;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public int[] getDices() {
        return dices;
    }

    public int[] getResources() {
        return resources;
    }

    public List<GameEvent> getGameEvents() {
        return events;
    }

    public void handleGameEvent(GameEvent gameEvent) {
        switch (gameEvent.getKind()) {
            case ROLLDICE ->  {
                dices[0] = ThreadLocalRandom.current().nextInt(1, 6 + 1);
                dices[1] = ThreadLocalRandom.current().nextInt(1, 6 + 1);

                //TODO do the effect of the dice roll
            }

        }

        //Add the executed event to the list of events.
        events.add(gameEvent);
    }


}
