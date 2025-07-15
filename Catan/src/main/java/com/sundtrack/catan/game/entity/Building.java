package com.sundtrack.catan.game.entity;

public class Building {
    public enum Kind {
        SETTLEMENT,
        CITY
    }

    public enum Direction {
        WEST, EAST
    }

    private Kind buildingKind;
    private final Direction direction;
    private final int q, r;
    private final String playerName;

    public Building(int q, int r, int s, Direction direction, Kind kind, String playerName) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
        this.buildingKind = kind;
        this.direction = direction;
        this.playerName = playerName;
    }

    public int getQ() {
        return q;
    }

    public int getR() {
        return r;
    }

    public int getS() {
        return -r-q;
    }

    public Building.Direction getDirection() {
        return direction;
    }

    public Kind getBuildingKind() {
        return buildingKind;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void upgradeBuilding() {
        if (buildingKind != Kind.SETTLEMENT) {
            //This building cant be upgraded
            throw new RuntimeException("Building can't be upgraded!");
        }
        buildingKind = Kind.CITY;
    }

    public String toKey() {
        return "q" + this.q + "r" + this.r + "s" + this.getS() + "d" + this.direction;
    }
}
