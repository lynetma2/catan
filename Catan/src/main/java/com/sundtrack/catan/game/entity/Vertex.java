package com.sundtrack.catan.game.entity;

public class Vertex {
    enum VertexKind {
        SETTLEMENT,
        CITY
    }

    enum Side {
        LEFT, RIGHT
    }

    private VertexKind vertexKind;
    private Side side;
    private int q, r;

    public Vertex( int q, int r, int s, Side side, VertexKind kind) {
        assert q + r + s == 0;
        this.q = q;
        this.r = r;
        this.vertexKind = kind;
        this.side = side;
    }
}
