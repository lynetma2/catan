package com.sundtrack.catan.game.services;

import com.sundtrack.catan.game.model.board.Board;
import com.sundtrack.catan.game.model.board.Building;
import com.sundtrack.catan.game.model.board.Road;
import com.sundtrack.catan.game.model.coordinates.EdgeCoordinates;
import com.sundtrack.catan.game.model.coordinates.HexCoordinates;
import com.sundtrack.catan.game.model.coordinates.VertexCoordinates;
import com.sundtrack.catan.game.model.enums.BuildingType;
import com.sundtrack.catan.game.model.enums.TileKind;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class MoveValidationService {

    public void validateBuildingPlacement(Board board, Building building, String playerId) {
        if (!Objects.equals(building.getPlayerName(), playerId)) {
            throw new IllegalStateException("Building owner does not match provided player ID");
        }

        if (isVertexOccupied(board, building.getVertex())) {
            throw new IllegalStateException("Building already exists for this vertex or the Vertex is blocked by another building");
        }

        boolean roadExists = false;
        EdgeCoordinates[] neighbours = building.edgeNeighbours();
        for (EdgeCoordinates neighbour : neighbours) {
            if (board.getRoads().containsKey(neighbour.toKey())) {
                if (Objects.equals(board.getRoads().get(neighbour.toKey()).getPlayerName(), playerId)) {
                    roadExists = true;
                    break;
                }
            }
        }

        if (!roadExists) {
            throw new IllegalStateException("Building can't be placed without a road connecting to it");
        }
    }

    public void validateRoadPlacement(Board board, Road road, String playerId) {
        if (!Objects.equals(road.getPlayerName(), playerId)) {
            throw new IllegalStateException("Road owner does not match provided player ID");
        }

        if (isRoadOccupied(board, road.getEdge())) {
            throw new IllegalStateException("Road already exists for this edge");
        }

        boolean linkToRoad = false;
        EdgeCoordinates[] neighbours = road.getEdge().edgeNeighbours();
        for (EdgeCoordinates neighbour : neighbours) {
            if (board.getRoads().containsKey(neighbour.toKey())) {
                Road placedRoad = board.getRoads().get(neighbour.toKey());
                if (Objects.equals(placedRoad.getPlayerName(), playerId)) {
                    //Ensure that the link is not blocked
                    VertexCoordinates[] placedVertices = placedRoad.getEdge().EdgeVertices();
                    VertexCoordinates[] toBePlacedVertices = road.getEdge().EdgeVertices();
                    for (VertexCoordinates vertex : toBePlacedVertices) {
                        for (VertexCoordinates placedVertex : placedVertices) {
                            if (vertex.equals(placedVertex)) {
                                //Should be empty
                                if (!board.getBuildings().containsKey(vertex.toKey())) {
                                    linkToRoad = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        boolean linkToBuilding = false;
        VertexCoordinates[] toBePlacedVertices = road.getEdge().EdgeVertices();
        for (VertexCoordinates vertex : toBePlacedVertices) {
            if (board.getBuildings().containsKey(vertex.toKey())) {
                linkToBuilding = board.getBuildings().get(vertex.toKey()).getPlayerName().equals(playerId);
            }
        }

        if (!linkToRoad && !linkToBuilding) {
            throw new IllegalStateException("Road not allowed for this edge");
        }
    }

    public boolean isVertexOccupied(Board board, VertexCoordinates coordinates) {
        boolean exactVertexUsed = board.getBuildings().containsKey(coordinates.toKey());
        boolean blockedFromNeighbour = false;
        VertexCoordinates[] neighbours = coordinates.vertexNeighbours();
        for (VertexCoordinates neighbour : neighbours) {
            if (board.getBuildings().containsKey(neighbour.toKey())) {
                blockedFromNeighbour = true;
                break;
            }
        }
        return exactVertexUsed || blockedFromNeighbour;
    }

    public boolean isRoadOccupied(Board board, EdgeCoordinates coordinates) {
        return board.getRoads().containsKey(coordinates.toKey());
    }

    public void validateRobberMove(Board board, HexCoordinates coordinates) {
        if (board.getRobber().equals(coordinates)) {
            throw new IllegalStateException("Robber already at this hex");
        }
        TileKind kind = board.getTiles().get(coordinates.toKey()).getTileKind();
        if (kind == TileKind.PORT_TILE || kind == TileKind.SEA_TILE) {
            throw new IllegalStateException("Robber can't swim or rob a port!");
        }
    }

    public void validateBuildingUpgrade(Board board, VertexCoordinates coordinates, String playerId) {
        if (!board.getBuildings().containsKey(coordinates.toKey())) {
            throw new IllegalStateException("Building does not exist for this vertex");
        }
        Building building = board.getBuildings().get(coordinates.toKey());
        if (!Objects.equals(building.getPlayerName(), playerId)) {
            throw new IllegalStateException("You cannot upgrade a building that is not yours");
        }
        if (building.getType() == BuildingType.CITY) {
            throw new IllegalStateException("Building can't be upgraded");
        }
    }
}