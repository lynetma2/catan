package com.sundtrack.catan.game;

public class Terrain extends Hex {
    public static final int LUMBER_KIND = 0;
    public static final int BRICK_KIND = 1;
    public static final int GRAIN_KIND = 2;
    public static final int WOOL_KIND = 3;
    public static final int ORE_KIND = 4;
    public static final int DESERT_KIND = 5;

    private int kind;

    public Terrain(int q, int r, int s) {
        super(q, r, s);
    }

}

