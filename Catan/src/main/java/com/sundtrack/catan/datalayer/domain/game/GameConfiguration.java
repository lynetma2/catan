package com.sundtrack.catan.datalayer.domain.game;

public class GameConfiguration {

    private final int winScore;
    private final int minArmySize;

    public GameConfiguration(int winningScore, int minArmySize) {
        winScore = winningScore;
        this.minArmySize = minArmySize;
    }

    public static GameConfiguration standard() {
        return new GameConfiguration(10, 3);
    }

    public int getWinScore() {
        return winScore;
    }

    public int getMinArmySize() {
        return minArmySize;
    }
}
