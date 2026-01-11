package com.sundtrack.catan.game.model.coordinates;

public class VertexCoordinates extends HexCoordinates {
    public enum Direction { EAST, WEST }

    private final Direction direction;

    public VertexCoordinates(int q, int r, Direction direction) {
        super(q, r);
        this.direction = direction;
    }

    public Direction getDirection() { return direction; }

    @Override
    public String toKey() {
        return super.toKey() + "v" + direction;
    }
    
    public HexCoordinates[] hexNeighbours() { return new HexCoordinates[0]; }
    public EdgeCoordinates[] edgeNeighbours() { return new EdgeCoordinates[0]; }
    public VertexCoordinates[] vertexNeighbours() { return new VertexCoordinates[0]; }
}