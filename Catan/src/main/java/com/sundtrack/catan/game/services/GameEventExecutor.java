package com.sundtrack.catan.game.services;

import com.sundtrack.catan.game.dto.events.*;
import com.sundtrack.catan.game.dto.world.EdgeCoordinatesDTO;
import com.sundtrack.catan.game.dto.world.VertexCoordinatesDTO;
import com.sundtrack.catan.game.model.*;
import com.sundtrack.catan.game.model.board.Building;
import com.sundtrack.catan.game.model.board.Road;
import com.sundtrack.catan.game.model.coordinates.EdgeCoordinates;
import com.sundtrack.catan.game.model.coordinates.VertexCoordinates;
import com.sundtrack.catan.game.model.enums.BuildingType;
import com.sundtrack.catan.game.model.player.Inventory;
import com.sundtrack.catan.game.model.player.Player;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;

@Service
public class GameEventExecutor {

    private final BoardService boardService;
    private final Random random = new Random();

    public GameEventExecutor(BoardService boardService) {
        this.boardService = boardService;
    }

    public void executeEvent(Game game, GameEvent event) {
        // Pattern matching switch (Java 17+)
        switch (event) {
            case BuildRoadEventDTO e -> handleBuildRoad(game, e);
            case BuildSettlementEventDTO e -> handleBuildSettlement(game, e);
            case BuildCityEventDTO e -> handleBuildCity(game, e);
            case RollDiceEventDTO e -> handleRollDice(game, e);
            case EndTurnEventDTO e -> handleEndTurn(game, e);
            case BuyDevelopmentCardEventDTO e -> handleBuyDevelopmentCard(game, e);
            case TransferResourcesEventDTO e -> handleTransferResources(game, e);
        }

        // Add the executed event to the history
        game.handleGameEvent(event);
    }

    private void handleBuildRoad(Game game, BuildRoadEventDTO event) {
        Player player = getPlayer(game, event.playerId());
        Inventory inv = player.getInventory();

        // 1. Validate Resources
        if (!inv.hasResources(game.getConfig().roadCost())) {
            throw new IllegalStateException("Not enough resources to build a road");
        }

        // 2. Execute on Board (Validates placement)
        Road road = new Road(mapEdge(event.edge()), event.playerId());
        boardService.addRoad(game.getBoard(), road, event.playerId());

        // 3. Deduct Resources
        inv.removeResources(game.getConfig().roadCost());
    }

    private void handleBuildSettlement(Game game, BuildSettlementEventDTO event) {
        Player player = getPlayer(game, event.playerId());
        Inventory inv = player.getInventory();

        // 1. Validate Resources
        if (!inv.hasResources(game.getConfig().settlementCost())) {
            throw new IllegalStateException("Not enough resources to build a settlement");
        }

        // 2. Execute on Board
        Building building = new Building(mapVertex(event.vertex()), BuildingType.SETTLEMENT, event.playerId());
        boardService.addBuilding(game.getBoard(), building, event.playerId());

        // 3. Deduct Resources
        inv.removeResources(game.getConfig().settlementCost());
    }

    private void handleBuildCity(Game game, BuildCityEventDTO event) {
        Player player = getPlayer(game, event.playerId());
        Inventory inv = player.getInventory();

        if (!inv.hasResources(game.getConfig().cityCost())) {
            throw new IllegalStateException("Not enough resources to build a city");
        }

        boardService.upgradeBuilding(game.getBoard(), mapVertex(event.vertex()), event.playerId());

        inv.removeResources(game.getConfig().cityCost());
    }

    private void handleRollDice(Game game, RollDiceEventDTO event) {
        int d1 = random.nextInt(6) + 1;
        int d2 = random.nextInt(6) + 1;
        game.setDices(new int[]{d1, d2});

        Map<String, Inventory> distributed = boardService.distributeResources(game.getBoard(), game.getDices(), game.getPlayers());

        // Merge distributed resources into player inventories
        distributed.forEach((playerId, inventory) -> {
            Player player = game.getPlayers().get(playerId);
            if (player != null) {
                inventory.getResources().forEach((type, count) -> {
                    if (count > 0) player.addResource(type, count);
                });
            }
        });
    }

    private void handleEndTurn(Game game, EndTurnEventDTO event) {
        // TODO: Implement turn rotation logic
    }

    private void handleBuyDevelopmentCard(Game game, BuyDevelopmentCardEventDTO event) {
        // TODO: Implement dev card logic
    }

    private void handleTransferResources(Game game, TransferResourcesEventDTO event) {
        // TODO: Implement trade logic
    }

    // --- Helpers ---

    private Player getPlayer(Game game, String playerId) {
        Player player = game.getPlayers().get(playerId);
        if (player == null) throw new IllegalArgumentException("Player not found: " + playerId);
        return player;
    }

    private EdgeCoordinates mapEdge(EdgeCoordinatesDTO dto) {
        EdgeCoordinates.Direction dir = switch (dto.getDirection()) {
            case NORTH -> EdgeCoordinates.Direction.NORTH;
            case EAST -> EdgeCoordinates.Direction.EAST;
            case WEST -> EdgeCoordinates.Direction.WEST;
        };
        return new EdgeCoordinates(dto.getQ(), dto.getR(), dir);
    }

    private VertexCoordinates mapVertex(VertexCoordinatesDTO dto) {
        VertexCoordinates.Direction dir = dto.getDirection() == VertexCoordinatesDTO.VertexDirectionDTO.EAST ? VertexCoordinates.Direction.EAST : VertexCoordinates.Direction.WEST;
        return new VertexCoordinates(dto.getQ(), dto.getR(), dir);
    }
}