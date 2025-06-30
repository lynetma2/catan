package com.sundtrack.catan.game;

public class Road {
    enum Direction {
        NORTH, EAST, WEST
    }

    private int q, r;
    private int player;
    private Direction direction;

    public Road(int q, int r, int s, Direction direction, int player) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
        this.player = player;
        this.direction = direction;
    }
}
