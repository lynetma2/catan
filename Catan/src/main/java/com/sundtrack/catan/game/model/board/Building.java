package com.sundtrack.catan.game.model.board;

import com.sundtrack.catan.game.model.coordinates.EdgeCoordinates;
import com.sundtrack.catan.game.model.coordinates.HexCoordinates;
import com.sundtrack.catan.game.model.coordinates.VertexCoordinates;
import com.sundtrack.catan.game.model.enums.BuildingType;

public class Building {

    private BuildingType type;
    private final VertexCoordinates vertex;
    private final String playerName;

    public Building(VertexCoordinates vertex, BuildingType type, String playerName) {
        this.vertex = vertex;
        this.type = type;
        this.playerName = playerName;
    }

    public VertexCoordinates getVertex() {
        return vertex;
    }

    public BuildingType getType() {
        return type;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void upgradeBuilding() {
        if (type != BuildingType.SETTLEMENT) {
            //This building cant be upgraded
            throw new RuntimeException("Building can't be upgraded!");
        }
        type = BuildingType.CITY;
    }

    public String toKey() {
        return vertex.toKey();
    }

    public HexCoordinates[] hexNeighbours() {
        return vertex.hexNeighbours();
    }

    public EdgeCoordinates[]  edgeNeighbours() {
        return vertex.edgeNeighbours();
    }

    public VertexCoordinates[] vertexNeighbours() {
        return vertex.vertexNeighbours();
    }
}
