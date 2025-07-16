package com.sundtrack.catan.game.entity;
import com.sundtrack.catan.game.entity.coordinates.EdgeCoordinates;
import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;
import com.sundtrack.catan.game.entity.coordinates.VertexCoordinates;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Board {

    private final Map<String, Hex> map;
    private final Map<String, Road> roads;
    private final Map<String, Building> buildings;
    private HexCoordinates robber;

    public Board(Map<String, Hex> map, HexCoordinates robber) {
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

    public boolean isHexOccupied(HexCoordinates hex) {
        return robber.equals(hex);
    }

    public boolean isRoadOccupied(EdgeCoordinates coordinates) {
        return roads.containsKey(coordinates.toKey());
    }

    public boolean isVertexOccupied(VertexCoordinates coordinates) {
        boolean exactVertexUsed = buildings.containsKey(coordinates.toKey());

        //Blocked by neighboring vertex
        boolean blockedFromNeighbour = false;
        VertexCoordinates[] neighbours = coordinates.vertexNeighbours();
        for (VertexCoordinates neighbour : neighbours) {
            if (buildings.containsKey(neighbour.toKey())) {
                blockedFromNeighbour = true;
                break;
            }
        }

        return exactVertexUsed || blockedFromNeighbour;
    }

    public void addBuilding(Building building) {
        if (isVertexOccupied(building.getCoordinates())) {
            throw new IllegalStateException("Building already exists for this vertex or the Vertex is blocked by another building");
        }

        boolean roadExists = false;
        EdgeCoordinates[] neighbours = building.edgeNeighbours();
        for (EdgeCoordinates neighbour : neighbours) {
            if (roads.containsKey(neighbour.toKey())) {
                roadExists = roads.get(neighbour.toKey()).getPlayerName() == building.getPlayerName();
            }
        }

        if (!roadExists) {
            throw new IllegalStateException("Building can't be placed without a road connecting to it");
        }

        //TODO make sure the early game special case can exist.

        buildings.put(building.toKey(), building);
    }

    public void addRoad(Road road) {
        if (isRoadOccupied(road.getCoordinates())) {
            throw new IllegalStateException("Road already exists for this edge");
        }

        //TODO check that the road to be added can be added legally.
            //Means check that there is a road from the same player connecting to this one, and check that there is no building from another player in between.



        roads.put(road.toKey(), road);
    }

    public void moveRobber(HexCoordinates coordinates) {
        if (isHexOccupied(coordinates)) {
            throw new IllegalStateException("Robber already at this hex");
        }
        Hex.TerrainKind kind = map.get(coordinates.toKey()).getKind();
        if (kind == Hex.TerrainKind.PORT || kind == Hex.TerrainKind.SEA) {
            throw new IllegalStateException("Robber can't swim or rob a port!");
        }

        robber = coordinates;
    }

    public void upgradeBuilding(VertexCoordinates coordinates) {
        if (!buildings.containsKey(coordinates.toKey()) || (buildings.containsKey(coordinates.toKey()) && buildings.get(coordinates.toKey()).getBuildingKind() == Building.Kind.CITY)) {
            throw new IllegalStateException("Building does not exist for this vertex or can't be upgraded");
        }
        buildings.get(coordinates.toKey()).upgradeBuilding();
    }

    public Map<String, Integer> calculateLongestRoad() {

        //TODO calculate this!
        return new HashMap<>();
    }

    public Map<String, Integer[]> resourceIncrement(int[] dices, Map<String, Player> players) {
        Map<String, Integer[]> resourceMap = new HashMap<>();
        players.forEach((playerName, player) -> {
            resourceMap.put(playerName, new  Integer[]{0, 0, 0, 0, 0});
        });

        //For each building, check the 3 hexes around it and give resources accordingly.
        buildings.values().forEach(building -> {
            HexCoordinates[] neighbours = building.hexNeighbours();
            for (HexCoordinates neighbour : neighbours) {
                if (neighbour.equals(robber)) {
                    continue;
                }
                Hex hex = map.get(neighbour.toKey());
                boolean isInstance = hex instanceof ResourceTerrain;
                if (isInstance) {
                    Hex.TerrainKind kind = hex.getKind();
                    int dice = ((ResourceTerrain) hex).getDice();
                    if (dices[0] + dices[1] == dice) {
                        Integer[] resources = resourceMap.get(building.getPlayerName());
                        Player.addResources(resources, kind, building.getBuildingKind() == Building.Kind.SETTLEMENT ? 1 : 2);
                    }
                }

            }
        });

        return resourceMap;
    }
}
