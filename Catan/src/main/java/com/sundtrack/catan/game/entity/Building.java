package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;
import com.sundtrack.catan.game.entity.coordinates.VertexCoordinates;

public class Building {
    public enum Kind {
        SETTLEMENT,
        CITY
    }

    private Kind buildingKind;
    private final VertexCoordinates coordinates;
    private final String playerName;

    public Building(VertexCoordinates coordinates, Kind kind, String playerName) {
        this.coordinates = coordinates;
        this.buildingKind = kind;
        this.playerName = playerName;
    }

    public VertexCoordinates getCoordinates() {
        return coordinates;
    }

    public Kind getBuildingKind() {
        return buildingKind;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void upgradeBuilding() {
        if (buildingKind != Kind.SETTLEMENT) {
            //This building cant be upgraded
            throw new RuntimeException("Building can't be upgraded!");
        }
        buildingKind = Kind.CITY;
    }

    public String toKey() {
        int q = coordinates.getQ();
        int r = coordinates.getR();
        int s = coordinates.getS();
        VertexCoordinates.Direction direction = coordinates.getDirection();
        return "q" + q + "r" + r + "s" + s + "d" + direction;
    }

    public HexCoordinates[] hexNeighbours() {
        VertexCoordinates.Direction direction = coordinates.getDirection();
        if (direction == VertexCoordinates.Direction.EAST) {
            HexCoordinates coordinates1 = new HexCoordinates(-1+coordinates.getQ(), coordinates.getR());
            HexCoordinates coordinates2 = new HexCoordinates(coordinates.getQ(), coordinates.getR());
            HexCoordinates coordinates3 = new HexCoordinates(-1+coordinates.getQ(), 1+coordinates.getR());
            return new HexCoordinates[]{coordinates1, coordinates2, coordinates3};
        } else {
            HexCoordinates coordinates1 = new HexCoordinates(1+coordinates.getQ(), -1+coordinates.getR());
            HexCoordinates coordinates2 = new HexCoordinates(coordinates.getQ(), coordinates.getR());
            HexCoordinates coordinates3 = new HexCoordinates(+1+coordinates.getQ(), coordinates.getR());
            return new HexCoordinates[]{coordinates1, coordinates2, coordinates3};
        }
    }
}
