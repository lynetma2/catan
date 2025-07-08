package com.sundtrack.catan.game;

import java.util.ArrayList;

public class Game {
    private final Board board;
    private final ArrayList<Player> players;

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
}
