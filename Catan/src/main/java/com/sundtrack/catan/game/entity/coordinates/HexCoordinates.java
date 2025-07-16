package com.sundtrack.catan.game.entity.coordinates;

import java.util.Objects;

public class HexCoordinates {
    private final int q,r;

    public HexCoordinates(int q, int r, int s) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
    }

    public HexCoordinates(int q, int r) {
        this.q = q;
        this.r = r;
    }

    public int getQ() {
        return q;
    }

    public int getR() {
        return r;
    }

    public int getS() {
        return -q-r;
    }

    public String toKey() {
        return "q" + q + "r" + r + "s" + getS();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        HexCoordinates that = (HexCoordinates) o;
        return q == that.q && r == that.r;
    }

    @Override
    public int hashCode() {
        return Objects.hash(q, r);
    }
}
