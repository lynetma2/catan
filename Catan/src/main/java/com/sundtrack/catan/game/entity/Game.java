package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.Events.GameEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

public class Game {

    //Resource array indices
    public static final int LUMBER_INDEX = 0;
    public static final int BRICK_INDEX = 1;
    public static final int GRAIN_INDEX = 2;
    public static final int WOOL_INDEX = 3;
    public static final int ORE_INDEX = 4;

    private final Board board;
    private final Map<String, Player> players;
    private final int[] dices = new int[] {1,1};
    private final List<GameEvent> events = new ArrayList<>();
    private final Integer[] resources = new Integer[] {19,19,19,19,19};
    //TODO add something to log the events, and save them.

    public Game(Board board, Map<String, Player> players) {
        this.board = board;
        this.players = players;
    }

    public Board getBoard() {
        return board;
    }

    public Map<String, Player> getPlayers() {
        return players;
    }

    public int[] getDices() {
        return dices;
    }

    public Integer[] getResources() {
        return resources;
    }

    public void setDices(int[] dices) {
        System.arraycopy(dices, 0, this.dices, 0, dices.length);
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
