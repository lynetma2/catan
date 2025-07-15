package com.sundtrack.catan.game.entity;

public class Road {
    public enum Direction {
        NORTH, EAST, WEST
    }

    private final int q, r;
    private final String playerName;
    private final Direction direction;

    public Road(int q, int r, int s, Direction direction, String playerName) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
        this.playerName = playerName;
        this.direction = direction;
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

    public String getPlayerName() {
        return playerName;
    }

    public Direction getDirection() {
        return direction;
    }

    public String toKey() {
        return "q" + this.q + "r" + this.r + "s" + this.getS() + "d" + this.direction;
    }
}
