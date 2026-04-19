package com.sundtrack.catan.game.model.board;

import com.sundtrack.catan.game.model.coordinates.HexCoordinates;

import java.util.HashMap;
import java.util.Map;

public class Board {

    private final Map<String, Tile> tiles;
    private final Map<String, Road> roads;
    private final Map<String, Building> buildings;
    private HexCoordinates robber;

    public Board(Map<String, Tile> tiles, HexCoordinates robber) {
        this.tiles = tiles;
        this.roads = new HashMap<>();
        this.buildings = new HashMap<>();
        this.robber = robber;
    }

    public Map<String, Tile> getTiles() {
        return tiles;
    }

    public Map<String, Road> getRoads() {
        return roads;
    }

    public Map<String, Building> getBuildings() {
        return buildings;
    }

    public HexCoordinates getRobber() {
        return robber;
    }

    public void setRobber(HexCoordinates coordinates) {
        robber = coordinates;
    }
}
