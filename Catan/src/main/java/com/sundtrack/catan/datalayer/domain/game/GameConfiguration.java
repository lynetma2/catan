package com.sundtrack.catan.datalayer.domain.game;

public class GameConfiguration {

    private final int winScore;
    private final int minArmySize;
    private final int minRoadLength;

    public GameConfiguration(int winScore, int minArmySize, int minRoadLength) {
        this.winScore = winScore;
        this.minArmySize = minArmySize;
        this.minRoadLength = minRoadLength;
    }

    public static GameConfiguration standard() {
        return new GameConfiguration(10, 3, 5);
    }

    public int getWinScore() {
        return winScore;
    }

    public int getMinArmySize() {
        return minArmySize;
    }

    public int getMinRoadLength() {
        return minRoadLength;
    }
}
