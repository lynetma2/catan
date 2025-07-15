package com.sundtrack.catan.game.entity;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Board {

    private final Map<String, Hex> map;
    private final Map<String, Road> roads;
    private final Map<String, Building> buildings;
    private Hex robber;

    public Board(Map<String, Hex> map, Hex robber) {
        this.map = map;
        this.roads = new HashMap<>();
        this.buildings = new HashMap<>();
        this.robber = robber;
    }

    public Map<String, Hex> getMap() {
        return map;
    }

    public Map<String, Road> getRoads() {
        return roads;
    }

    public Map<String, Building> getBuildings() {
        return buildings;
    }

    public boolean isHexOccupied(Hex hex) {
        return robber.getQ() == hex.getQ() && robber.getR() == hex.getR() && robber.getS() == hex.getS();
    }

    public boolean isRoadOccupied(Road road) {
        return roads.containsKey(road.toKey());
    }

    public boolean isVertexOccupied(Building building) {
        return buildings.containsKey(building.toKey());
    }

    public void addBuilding(Building building) {
        if (isVertexOccupied(building)) {
            throw new IllegalStateException("Building already exists for this vertex");
        }
        buildings.put(building.toKey(), building);
    }

    public void addRoad(Road road) {
        if (isRoadOccupied(road)) {
            throw new IllegalStateException("Road already exists for this edge");
        }
        roads.put(road.toKey(), road);
    }

    public void moveRobber(Hex hex) {
        if (isHexOccupied(hex)) {
            throw new IllegalStateException("Robber already at this hex");
        }
        if (hex.getKind() == Hex.TerrainKind.PORT || hex.getKind() == Hex.TerrainKind.SEA) {
            throw new IllegalStateException("Robber can't swim or rob a port!");
        }

        robber = hex;
    }

    public void upgradeBuilding(Building building) {
        if (!buildings.containsKey(building.toKey()) || (buildings.containsKey(building.toKey()) && buildings.get(building.toKey()).getBuildingKind() == Building.Kind.CITY)) {
            throw new IllegalStateException("Building does not exist for this vertex or can't be upgraded");
        }
        buildings.get(building.toKey()).upgradeBuilding();
    }

    public Map<String, Integer> calculateLongestRoad() {

        //TODO calculate this!
        return new HashMap<>();
    }

    public Map<String, List<Integer>> diceResult(int[] dices) {
        //For each building, check the 3 hexes around it and give resources accordingly.

        buildings.values().forEach(building -> {
            //TODO create a record for storing the coordinates with two constructors and use it around the codebase.
        });

        //TODO calculate this!
        return new HashMap<>();
    }
}
