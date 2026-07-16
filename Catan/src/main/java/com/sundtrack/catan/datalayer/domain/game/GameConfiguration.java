package com.sundtrack.catan.datalayer.domain.game;

public class GameConfiguration {

    private final int winScore;
    private final int minArmySize;
    private final int minRoadLength;
    private final int maxNumberOfSettlements;
    private final int maxNumberOfCities;
    private final int maxNumberOfRoads;

    public GameConfiguration(int winScore, int minArmySize, int minRoadLength, int maxNumberOfSettlements, int maxNumberOfCities, int maxNumberOfRoads) {
        this.winScore = winScore;
        this.minArmySize = minArmySize;
        this.minRoadLength = minRoadLength;
        this.maxNumberOfSettlements = maxNumberOfSettlements;
        this.maxNumberOfCities = maxNumberOfCities;
        this.maxNumberOfRoads = maxNumberOfRoads;
    }

    public static GameConfiguration standard() {
        return new GameConfiguration(
                10,
                3,
                5,
                5,
                4,
                15);
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

    public int getMaxNumberOfSettlements() {
        return maxNumberOfSettlements;
    }

    public int getMaxNumberOfCities() {
        return maxNumberOfCities;
    }

    public int getMaxNumberOfRoads() {
        return maxNumberOfRoads;
    }
}
