package com.sundtrack.catan.game.entity.coordinates;

import java.util.Objects;

public class VertexCoordinates extends HexCoordinates {

    public enum Direction {
        WEST, EAST
    }

    private final Direction direction;

    public VertexCoordinates(int q, int r, int s, Direction direction) {
        super(q, r, s);
        this.direction = direction;
    }

    public VertexCoordinates(int q, int r, Direction direction) {
        super(q, r);
        this.direction = direction;
    }

    public Direction getDirection() {
        return direction;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        VertexCoordinates that = (VertexCoordinates) o;
        return direction == that.direction;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), direction);
    }
}
