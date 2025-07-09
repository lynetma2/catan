package com.sundtrack.catan.game;

import com.sundtrack.catan.messaging.Events.GameEvent;
import java.util.ArrayList;

public class Game {

    private final Board board;
    private final ArrayList<Player> players;
    private final int[] dices = new int[] {1,1};
    private final ArrayList<GameEvent> events = new ArrayList<>();
    private final int[] resources = new int[] {19,19,19,19,19};
    //TODO add something to log the events, and save them.

    public Game(Board board, ArrayList<Player> players) {
        this.board = board;
        this.players = players;
    }

    public Board getBoard() {
        return board;
    }

    public ArrayList<Player> getPlayers() {
        return players;
    }

    public int[] getDices() {
        return dices;
    }

    public int[] getResources() {
        return resources;
    }

    public ArrayList<GameEvent> getGameEvents() {
        return events;
    }
}
