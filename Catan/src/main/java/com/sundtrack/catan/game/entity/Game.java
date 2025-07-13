package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.messaging.Events.GameEvent;
import java.util.ArrayList;
import java.util.List;

public class Game {

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
}
