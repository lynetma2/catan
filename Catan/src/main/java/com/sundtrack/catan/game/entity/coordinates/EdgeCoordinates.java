package com.sundtrack.catan.game.entity.coordinates;

import java.util.Objects;

public class EdgeCoordinates extends HexCoordinates{

    public enum Direction{
        NORTH, EAST, WEST
    }

    private final Direction direction;

    public EdgeCoordinates(int q, int r, int s, Direction direction) {
        super(q, r, s);
        this.direction = direction;
    }

    public EdgeCoordinates(int q, int r, Direction direction) {
        super(q, r);
        this.direction = direction;
    }

    public Direction getDirection() {
        return direction;
    }

    public EdgeCoordinates[] edgeNeighbours() {
        int q  = super.getQ();
        int r = super.getR();
        EdgeCoordinates[] neighbours = new EdgeCoordinates[4];
        switch (direction) {
            case EAST -> {
                neighbours[0] = new EdgeCoordinates(q,r, Direction.NORTH);
                neighbours[1] = new EdgeCoordinates(q+1,r-1, Direction.WEST);
                neighbours[2] = new EdgeCoordinates(q+1,r,Direction.NORTH);
                neighbours[3] = new EdgeCoordinates(q+1,r,Direction.WEST);
            }
            case WEST -> {
                neighbours[0] = new EdgeCoordinates(q,r, Direction.NORTH);
                neighbours[1] = new EdgeCoordinates(q-1,r, Direction.EAST);
                neighbours[2] = new EdgeCoordinates(q-1,r+1,Direction.NORTH);
                neighbours[3] = new EdgeCoordinates(q-1,r+1,Direction.EAST);
            }
            case NORTH -> {
                neighbours[0] = new EdgeCoordinates(q,r, Direction.EAST);
                neighbours[1] = new EdgeCoordinates(q,r,Direction.WEST);
                neighbours[2] = new EdgeCoordinates(q-1,r,Direction.EAST);
                neighbours[3] = new EdgeCoordinates(q+1,r-1,Direction.WEST);
            }
        }
        return neighbours;
    }

    public VertexCoordinates[] vertexNeighbours() {
        int q  = super.getQ();
        int r = super.getR();
        VertexCoordinates[] neighbours = new VertexCoordinates[4];
        switch (direction) {
            case NORTH -> {
                neighbours[0] = new VertexCoordinates(q,r, VertexCoordinates.Direction.WEST);
                neighbours[1] = new VertexCoordinates(q,r, VertexCoordinates.Direction.EAST);
                neighbours[2] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.WEST);
                neighbours[3] = new VertexCoordinates(q,r-1,VertexCoordinates.Direction.EAST);
            }
            case EAST -> {
                neighbours[0] = new VertexCoordinates(q+2,r-1, VertexCoordinates.Direction.WEST);
                neighbours[1] = new VertexCoordinates(q+1,r, VertexCoordinates.Direction.WEST);
                neighbours[2] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.EAST);
                neighbours[3] = new VertexCoordinates(q-1,r,VertexCoordinates.Direction.EAST);
            }
            case WEST -> {
                neighbours[0] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.WEST);
                neighbours[1] = new VertexCoordinates(q+1,r-1, VertexCoordinates.Direction.WEST);
                neighbours[2] = new VertexCoordinates(q-2,r+1, VertexCoordinates.Direction.EAST);
                neighbours[3] = new VertexCoordinates(q-1,r+1, VertexCoordinates.Direction.EAST);
            }
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
        EdgeCoordinates that = (EdgeCoordinates) o;
        return direction == that.direction;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), direction);
    }
}
