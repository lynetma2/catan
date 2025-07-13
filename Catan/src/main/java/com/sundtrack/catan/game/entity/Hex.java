package com.sundtrack.catan.game.entity;

public class Hex {
    enum TerrainKind {
        LUMBER,
        BRICK,
        GRAIN,
        WOOL,
        ORE,
        DESERT,
        PORT,
        SEA
    }

    private int q, r;
    private TerrainKind kind;

    public Hex(int q, int r, int s, TerrainKind kind) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
        this.kind = kind;
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

    public TerrainKind getKind() {
        return kind;
    }
}
