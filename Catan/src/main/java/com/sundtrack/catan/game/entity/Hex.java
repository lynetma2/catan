package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;

public class Hex {
    public enum TerrainKind {
        LUMBER,
        BRICK,
        GRAIN,
        WOOL,
        ORE,
        DESERT,
        PORT,
        SEA
    }

    private final HexCoordinates coordinates;
    private final TerrainKind kind;

    public Hex(HexCoordinates coordinates, TerrainKind kind) {
        this.coordinates = coordinates;
        this.kind = kind;
    }

    public Hex(int q, int r, TerrainKind kind) {
        this.coordinates = new HexCoordinates(q, r);
        this.kind = kind;
    }

    public Hex(int q, int r, int s, TerrainKind kind) {
        this.coordinates = new HexCoordinates(q, r, s);
        this.kind = kind;
    }

    public HexCoordinates getCoordinates() {
        return coordinates;
    }

    public TerrainKind getKind() {
        return kind;
    }

    public String toKey() {
        int q = coordinates.getQ();
        int r = coordinates.getR();
        int s = coordinates.getS();
        return "q" + q + "r" + r + "s" + s;
    }
}
