package com.sundtrack.catan.game.model.coordinates;

import java.util.Objects;

public class HexCoordinates {
    private final int q;
    private final int r;
    private final int s;

    public HexCoordinates(int q, int r, int s) {
        this.q = q;
        this.r = r;
        this.s = s;
        if (q + r + s != 0) throw new IllegalArgumentException("q + r + s must be 0");
    }

    public HexCoordinates(int q, int r) {
        this(q, r, -q - r);
    }

    public int getQ() { return q; }
    public int getR() { return r; }
    public int getS() { return s; }

    public String toKey() {
        return q + "," + r;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HexCoordinates that = (HexCoordinates) o;
        return q == that.q && r == that.r && s == that.s;
    }

    @Override
    public int hashCode() {
        return Objects.hash(q, r, s);
    }
}