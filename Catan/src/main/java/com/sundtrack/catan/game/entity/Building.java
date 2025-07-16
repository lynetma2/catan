package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.coordinates.EdgeCoordinates;
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
        return coordinates.toKey();
    }

    public HexCoordinates[] hexNeighbours() {
        return coordinates.hexNeighbours();
    }

    public EdgeCoordinates[]  edgeNeighbours() {
        return coordinates.edgeNeighbours();
    }

    public VertexCoordinates[] vertexNeighbours() {
        return coordinates.vertexNeighbours();
    }
}
