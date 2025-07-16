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

    public HexCoordinates[] hexNeighbours() {
        int q = super.getQ();
        int r = super.getR();
        HexCoordinates[] neighbours = new HexCoordinates[3];
        if (direction == VertexCoordinates.Direction.WEST) {
            neighbours[0] = new HexCoordinates(q - 1, r);
            neighbours[1] = new HexCoordinates(q, r);
            neighbours[2] = new HexCoordinates(q, r+1);
        } else {
            neighbours[0] = new HexCoordinates(q+1, r-1);
            neighbours[1] = new HexCoordinates(q, r);
            neighbours[2] = new HexCoordinates(q+1, r);
        }
        return neighbours;
    }

    public EdgeCoordinates[]  edgeNeighbours() {
        int q = super.getQ();
        int r = super.getR();
        EdgeCoordinates[] neighbours = new EdgeCoordinates[3];
        if (direction == VertexCoordinates.Direction.WEST) {
            neighbours[0] = new EdgeCoordinates(q,r, EdgeCoordinates.Direction.WEST);
            neighbours[1] = new EdgeCoordinates(q-1, r+1, EdgeCoordinates.Direction.NORTH);
            neighbours[2] = new EdgeCoordinates(q-1, r+1, EdgeCoordinates.Direction.EAST);
        } else {
            neighbours[0] = new EdgeCoordinates(q,r, EdgeCoordinates.Direction.EAST);
            neighbours[1] = new EdgeCoordinates(q+1, r, EdgeCoordinates.Direction.NORTH);
            neighbours[2] = new EdgeCoordinates(q+1, r, EdgeCoordinates.Direction.WEST);
        }
        return neighbours;
    }

    public VertexCoordinates[] vertexNeighbours() {
        int q  = super.getQ();
        int r = super.getR();
        VertexCoordinates[] neighbours = new VertexCoordinates[3];
        if (direction == VertexCoordinates.Direction.WEST) {
            neighbours[0] = new VertexCoordinates(q-1,r, VertexCoordinates.Direction.EAST);
            neighbours[1] = new VertexCoordinates(q-2,1+r, VertexCoordinates.Direction.EAST);
            neighbours[2] = new VertexCoordinates(q-1,1+r, VertexCoordinates.Direction.EAST);
        } else {
            neighbours[0] = new VertexCoordinates(q+1, r-1, VertexCoordinates.Direction.WEST);
            neighbours[1] = new  VertexCoordinates(q+2, r-1, VertexCoordinates.Direction.WEST);
            neighbours[2] = new VertexCoordinates(q+1, r, VertexCoordinates.Direction.WEST);
        }
        return neighbours;
    }

    @Override
    public String toKey() {
        return super.toKey() + "d" + direction;
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
