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
        if (direction == VertexCoordinates.Direction.WEST) {
            HexCoordinates coordinates1 = new HexCoordinates(-1+super.getQ(), super.getR());
            HexCoordinates coordinates2 = new HexCoordinates(super.getQ(), super.getR());
            HexCoordinates coordinates3 = new HexCoordinates(-1+super.getQ(), 1+super.getR());
            return new HexCoordinates[]{coordinates1, coordinates2, coordinates3};
        } else {
            HexCoordinates coordinates1 = new HexCoordinates(1+super.getQ(), -1+super.getR());
            HexCoordinates coordinates2 = new HexCoordinates(super.getQ(), super.getR());
            HexCoordinates coordinates3 = new HexCoordinates(+1+super.getQ(), super.getR());
            return new HexCoordinates[]{coordinates1, coordinates2, coordinates3};
        }
    }

    public EdgeCoordinates[]  edgeNeighbours() {
        if (direction == VertexCoordinates.Direction.WEST) {
            EdgeCoordinates coordinates1 = new EdgeCoordinates(super.getQ(), super.getR(), EdgeCoordinates.Direction.WEST);
            EdgeCoordinates coordinates2 = new EdgeCoordinates(super.getQ()-1, super.getR()+1, EdgeCoordinates.Direction.NORTH);
            EdgeCoordinates coordinates3 = new EdgeCoordinates(super.getQ()-1, super.getR()+1, EdgeCoordinates.Direction.EAST);
            return new EdgeCoordinates[]{coordinates1, coordinates2, coordinates3};
        } else {
            EdgeCoordinates coordinates1 = new EdgeCoordinates(super.getQ(), super.getR(), EdgeCoordinates.Direction.EAST);
            EdgeCoordinates coordinates2 = new EdgeCoordinates(super.getQ()+1, super.getR(), EdgeCoordinates.Direction.NORTH);
            EdgeCoordinates coordinates3 = new EdgeCoordinates(super.getQ()+1, super.getR(), EdgeCoordinates.Direction.WEST);
            return new EdgeCoordinates[]{coordinates1, coordinates2, coordinates3};
        }
    }

    public VertexCoordinates[] vertexNeighbours() {
        int q  = super.getQ();
        int r = super.getR();
        if (direction == VertexCoordinates.Direction.WEST) {
            VertexCoordinates coordinates1 = new VertexCoordinates(q-1,r, VertexCoordinates.Direction.EAST);
            VertexCoordinates coordinates2 = new VertexCoordinates(q-2,1+r, VertexCoordinates.Direction.EAST);
            VertexCoordinates coordinates3 = new VertexCoordinates(q-1,1+r, VertexCoordinates.Direction.EAST);
            return new VertexCoordinates[]{coordinates1, coordinates2, coordinates3};
        } else {
            VertexCoordinates coordinates1 = new VertexCoordinates(q+1, r-1, VertexCoordinates.Direction.WEST);
            VertexCoordinates coordinates2 = new  VertexCoordinates(q+2, r-1, VertexCoordinates.Direction.WEST);
            VertexCoordinates coordinates3 = new VertexCoordinates(q+1, r, VertexCoordinates.Direction.WEST);
            return new VertexCoordinates[]{coordinates1, coordinates2, coordinates3};
        }
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
