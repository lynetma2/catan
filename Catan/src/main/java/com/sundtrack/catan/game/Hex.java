package com.sundtrack.catan.game;

public class Hex {

    private int q, r;

    public Hex(int q, int r, int s) {
        assert q + r + s == 0;
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
        return -r-q;
    }
}
