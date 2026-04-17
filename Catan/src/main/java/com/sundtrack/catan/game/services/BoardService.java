package com.sundtrack.catan.game.services;

import com.sundtrack.catan.game.model.board.Board;
import com.sundtrack.catan.game.model.board.Building;
import com.sundtrack.catan.game.model.board.Road;
import com.sundtrack.catan.game.model.board.Tile;
import com.sundtrack.catan.game.model.coordinates.HexCoordinates;
import com.sundtrack.catan.game.model.coordinates.VertexCoordinates;
import com.sundtrack.catan.game.model.enums.BuildingType;
import com.sundtrack.catan.game.model.enums.ResourceType;
import com.sundtrack.catan.game.model.enums.TileKind;
import com.sundtrack.catan.game.model.player.Inventory;
import com.sundtrack.catan.game.model.player.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class BoardService {

    private final MoveValidationService moveValidationService;

    public BoardService(MoveValidationService moveValidationService) {
        this.moveValidationService = moveValidationService;
    }

    public Board createClassicBoard() {
        ArrayList<Tile> map = new ArrayList<>();

        // Border (Sea & Ports)
        map.add(new Tile(new HexCoordinates(0, -3, 3), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(1, -3, 2), TileKind.PORT_TILE, null, null)); // Any Port
        map.add(new Tile(new HexCoordinates(2, -3, 1), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(3, -3, 0), TileKind.PORT_TILE, null, null)); // Any Port
        map.add(new Tile(new HexCoordinates(3, -2, -1), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(3, -2, -1), TileKind.PORT_TILE, ResourceType.BRICK, null));
        map.add(new Tile(new HexCoordinates(3, 0, -3), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(2, 1, -3), TileKind.PORT_TILE, ResourceType.WOOD, null));
        map.add(new Tile(new HexCoordinates(1, 2, -3), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(0, 3, -3), TileKind.PORT_TILE, null, null)); // Any Port
        map.add(new Tile(new HexCoordinates(-1, 3, -2), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(-2, 3, -1), TileKind.PORT_TILE, ResourceType.WHEAT, null));
        map.add(new Tile(new HexCoordinates(-3, 3, 0), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(-3, 2, -1), TileKind.PORT_TILE, ResourceType.ORE, null));
        map.add(new Tile(new HexCoordinates(-3, 1, 2), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(-3, 0, 3), TileKind.PORT_TILE, null, null)); // Any Port
        map.add(new Tile(new HexCoordinates(-2, -1, 3), TileKind.SEA_TILE, null, null));
        map.add(new Tile(new HexCoordinates(-1, -2, 3), TileKind.PORT_TILE, ResourceType.SHEEP, null));

        // Internal Resources
        map.add(new Tile(new HexCoordinates(0, -2, 2), TileKind.RESOURCE_TILE, ResourceType.BRICK, 5));
        map.add(new Tile(new HexCoordinates(-1, -1, 2), TileKind.RESOURCE_TILE, ResourceType.BRICK, 2));
        map.add(new Tile(new HexCoordinates(-2, 0, 2), TileKind.RESOURCE_TILE, ResourceType.ORE, 6));

        map.add(new Tile(new HexCoordinates(-2, 1, 1), TileKind.RESOURCE_TILE, ResourceType.WHEAT, 3));
        map.add(new Tile(new HexCoordinates(-2, 2, 0), TileKind.RESOURCE_TILE, ResourceType.BRICK, 8));
        map.add(new Tile(new HexCoordinates(-1, 2, -1), TileKind.RESOURCE_TILE, ResourceType.WHEAT, 10));
        map.add(new Tile(new HexCoordinates(0, 2, -2), TileKind.RESOURCE_TILE, ResourceType.WOOD, 9));

        map.add(new Tile(new HexCoordinates(1, 1, -2), TileKind.RESOURCE_TILE, ResourceType.SHEEP, 12));
        map.add(new Tile(new HexCoordinates(2, 0, -2), TileKind.RESOURCE_TILE, ResourceType.ORE, 11));
        map.add(new Tile(new HexCoordinates(2, -1, -1), TileKind.DESSERT_TILE, null, null));
        map.add(new Tile(new HexCoordinates(2, -2, 0), TileKind.RESOURCE_TILE, ResourceType.SHEEP, 4));
        map.add(new Tile(new HexCoordinates(1, -2, 1), TileKind.RESOURCE_TILE, ResourceType.SHEEP, 8));

        map.add(new Tile(new HexCoordinates(0, -1, 1), TileKind.RESOURCE_TILE, ResourceType.ORE, 10));
        map.add(new Tile(new HexCoordinates(-1, 0, 1), TileKind.RESOURCE_TILE, ResourceType.WHEAT, 9));
        map.add(new Tile(new HexCoordinates(-1, 1, 0), TileKind.RESOURCE_TILE, ResourceType.WOOD, 4));
        map.add(new Tile(new HexCoordinates(0, 1, -1), TileKind.RESOURCE_TILE, ResourceType.WHEAT, 5));

        map.add(new Tile(new HexCoordinates(1, 0, -1), TileKind.RESOURCE_TILE, ResourceType.WOOD, 6));
        map.add(new Tile(new HexCoordinates(1, -1, 0), TileKind.RESOURCE_TILE, ResourceType.WOOD, 3));
        map.add(new Tile(new HexCoordinates(0, 0, 0), TileKind.RESOURCE_TILE, ResourceType.SHEEP, 11));

        Map<String, Tile> tileMap = new HashMap<>();
        map.forEach(tile -> tileMap.put(tile.getHex().toKey(), tile));

        return new Board(tileMap, new HexCoordinates(0, 3)); // Robber starts on Desert (approx)
    }

    public void addBuilding(Board board, Building building, String playerId) {
        moveValidationService.validateBuildingPlacement(board, building, playerId);
        board.getBuildings().put(building.toKey(), building);
    }

    public void addRoad(Board board, Road road, String playerId) {
        moveValidationService.validateRoadPlacement(board, road, playerId);
        board.getRoads().put(road.toKey(), road);
    }

    public void moveRobber(Board board, HexCoordinates coordinates) {
        moveValidationService.validateRobberMove(board, coordinates);
        board.setRobber(coordinates);
    }

    public void upgradeBuilding(Board board, VertexCoordinates coordinates, String playerId) {
        moveValidationService.validateBuildingUpgrade(board, coordinates, playerId);
        board.getBuildings().get(coordinates.toKey()).upgradeBuilding();
    }

    public Map<String, Inventory> distributeResources(Board board, int[] dices, Map<String, Player> players) {
        Map<String, Inventory> resourceMap = new HashMap<>();
        players.forEach((name, p) -> resourceMap.put(name, new Inventory()));

        board.getBuildings().values().forEach(building -> {
            for (HexCoordinates neighbour : building.hexNeighbours()) {
                if (neighbour.equals(board.getRobber())) continue;
                Tile tile = board.getTiles().get(neighbour.toKey());
                if (tile != null && tile.getTileKind() == TileKind.RESOURCE_TILE && tile.getDice() != null && (dices[0] + dices[1] == tile.getDice())) {
                    Inventory inventory = resourceMap.get(building.getPlayerName());
                    inventory.addResource(tile.getResourceType(), building.getType() == BuildingType.SETTLEMENT ? 1 : 2);
                }
            }
        });
        return resourceMap;
    }
}