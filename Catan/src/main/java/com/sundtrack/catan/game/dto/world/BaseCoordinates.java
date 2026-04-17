package com.sundtrack.catan.game.dto.world;

public class BaseCoordinates {
    private int q;
    private int r;

    public BaseCoordinates() {
    }

    public BaseCoordinates(int q, int r) {
        this.q = q;
        this.r = r;
    }

    public int getQ() {
        return q;
    }

    public void setQ(int q) {
        this.q = q;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }
}
