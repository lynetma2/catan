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
        switch (direction) {
            case EAST -> {
                EdgeCoordinates coordinates1 = new EdgeCoordinates(q,r, Direction.NORTH);
                EdgeCoordinates coordinates2 = new EdgeCoordinates(q+1,r-1, Direction.WEST);
                EdgeCoordinates coordinates3 = new EdgeCoordinates(q+1,r,Direction.NORTH);
                EdgeCoordinates coordinates4 = new EdgeCoordinates(q+1,r,Direction.WEST);
                return new EdgeCoordinates[]{coordinates1,coordinates2,coordinates3,coordinates4};
            }
            case WEST -> {
                EdgeCoordinates coordinates1 = new EdgeCoordinates(q,r, Direction.NORTH);
                EdgeCoordinates coordinates2 = new EdgeCoordinates(q-1,r, Direction.EAST);
                EdgeCoordinates coordinates3 = new EdgeCoordinates(q-1,r+1,Direction.NORTH);
                EdgeCoordinates coordinates4 = new EdgeCoordinates(q-1,r+1,Direction.EAST);
                return new EdgeCoordinates[]{coordinates1,coordinates2,coordinates3,coordinates4};
            }
            case NORTH -> {
                EdgeCoordinates coordinates1 = new EdgeCoordinates(q,r, Direction.EAST);
                EdgeCoordinates coordinates2 = new EdgeCoordinates(q,r,Direction.WEST);
                EdgeCoordinates coordinates3 = new EdgeCoordinates(q-1,r,Direction.EAST);
                EdgeCoordinates coordinates4 = new EdgeCoordinates(q+1,r-1,Direction.WEST);
                return  new EdgeCoordinates[]{coordinates1,coordinates2,coordinates3,coordinates4};
            }
        }
        return null;
    }

    public VertexCoordinates[] vertexNeighbours() {
        int q  = super.getQ();
        int r = super.getR();
        VertexCoordinates[] coordinates = new VertexCoordinates[4];
        switch (direction) {
            case NORTH -> {
                coordinates[0] = new VertexCoordinates(q,r, VertexCoordinates.Direction.WEST);
                coordinates[1] = new VertexCoordinates(q,r, VertexCoordinates.Direction.EAST);
                coordinates[2] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.WEST);
                coordinates[3] = new VertexCoordinates(q,r-1,VertexCoordinates.Direction.EAST);
            }
            case EAST -> {
                coordinates[0] = new VertexCoordinates(q+2,r-1, VertexCoordinates.Direction.WEST);
                coordinates[1] = new VertexCoordinates(q+1,r, VertexCoordinates.Direction.WEST);
                coordinates[2] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.EAST);
                coordinates[3] = new VertexCoordinates(q-1,r,VertexCoordinates.Direction.EAST);
            }
            case WEST -> {
                coordinates[0] = new VertexCoordinates(q,r-1, VertexCoordinates.Direction.WEST);
                coordinates[1] = new VertexCoordinates(q+1,r-1, VertexCoordinates.Direction.WEST);
                coordinates[2] = new VertexCoordinates(q-2,r+1, VertexCoordinates.Direction.EAST);
                coordinates[3] = new VertexCoordinates(q-1,r+1, VertexCoordinates.Direction.EAST);
            }
        }
        return coordinates;
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
