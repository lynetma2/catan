package com.sundtrack.catan.datalayer.domain.game;

public class GameConfiguration {

    private final int winScore;

    public GameConfiguration(int winningScore) {
        winScore = winningScore;
    }
    
    public static GameConfiguration standard() {
        return new GameConfiguration(10);
    }

    public int getWinScore() {
        return winScore;
    }
}
