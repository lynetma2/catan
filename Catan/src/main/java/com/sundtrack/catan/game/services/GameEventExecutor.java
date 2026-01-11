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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class GameEventExecutor {

    private final BoardService boardService;
    private final Random random = new Random();

    public GameEventExecutor(BoardService boardService) {
        this.boardService = boardService;
    }

    public List<GameEvent> executeEvent(Game game, GameEvent event) {
        List<GameEvent> consequences = new ArrayList<>();

        // Pattern matching switch (Java 17+)
        switch (event) {
            case BuildRoadEventDTO e -> consequences.addAll(handleBuildRoad(game, e));
            case BuildSettlementEventDTO e -> consequences.addAll(handleBuildSettlement(game, e));
            case BuildCityEventDTO e -> consequences.addAll(handleBuildCity(game, e));
            case RollDiceEventDTO e -> consequences.addAll(handleRollDice(game, e));
            case EndTurnEventDTO e -> consequences.addAll(handleEndTurn(game, e));
            case BuyDevelopmentCardEventDTO e -> consequences.addAll(handleBuyDevelopmentCard(game, e));
            case TransferResourcesEventDTO e -> consequences.addAll(handleTransferResources(game, e));
        }

        // Add the executed event to the history
        consequences.forEach(game::handleGameEvent);

        return consequences;
    }

    private List<GameEvent> handleBuildRoad(Game game, BuildRoadEventDTO event) {
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

        // 4. Generate Consequences
        return List.of(
                createPaymentEvent(event.playerId(), game.getConfig().roadCost()),
                event // The confirmation of the build
        );
    }

    private List<GameEvent> handleBuildSettlement(Game game, BuildSettlementEventDTO event) {
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

        return List.of(
                createPaymentEvent(event.playerId(), game.getConfig().settlementCost()),
                event
        );
    }

    private List<GameEvent> handleBuildCity(Game game, BuildCityEventDTO event) {
        Player player = getPlayer(game, event.playerId());
        Inventory inv = player.getInventory();

        if (!inv.hasResources(game.getConfig().cityCost())) {
            throw new IllegalStateException("Not enough resources to build a city");
        }

        boardService.upgradeBuilding(game.getBoard(), mapVertex(event.vertex()), event.playerId());

        inv.removeResources(game.getConfig().cityCost());

        return List.of(
                createPaymentEvent(event.playerId(), game.getConfig().cityCost()),
                event
        );
    }

    private List<GameEvent> handleRollDice(Game game, RollDiceEventDTO event) {
        List<GameEvent> events = new ArrayList<>();

        int d1 = random.nextInt(6) + 1;
        int d2 = random.nextInt(6) + 1;
        game.setDices(new int[]{d1, d2});
        events.add(event); // Add the roll event first

        Map<String, Inventory> distributed = boardService.distributeResources(game.getBoard(), game.getDices(), game.getPlayers());

        // Merge distributed resources into player inventories and generate events
        distributed.forEach((playerId, inventory) -> {
            Player player = game.getPlayers().get(playerId);
            if (player != null) {
                inventory.getResources().forEach((type, count) -> {
                    if (count > 0) player.addResource(type, count);
                });
            }
            if (!inventory.getResources().isEmpty()) {
                // Convert internal resources to DTO resources
                Map<ResourceTypeDTO, Integer> resourcesDTO = inventory.getResources().entrySet().stream()
                        .filter(e -> e.getValue() > 0)
                        .collect(Collectors.toMap(e -> mapResourceType(e.getKey()), Map.Entry::getValue));

                if (!resourcesDTO.isEmpty()) {
                    events.add(new TransferResourcesEventDTO("Server", "Bank", playerId, resourcesDTO, resourcesDTO.values().stream().reduce(0, Integer::sum)));
                }
            }
        });

        return events;
    }

    private List<GameEvent> handleEndTurn(Game game, EndTurnEventDTO event) {
        // TODO: Implement turn rotation logic
        return List.of(event);
    }

    private List<GameEvent> handleBuyDevelopmentCard(Game game, BuyDevelopmentCardEventDTO event) {
        // TODO: Implement dev card logic
        return List.of(event);
    }

    private List<GameEvent> handleTransferResources(Game game, TransferResourcesEventDTO event) {
        // TODO: Implement trade logic
        return List.of(event);
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

    private ResourceTypeDTO mapResourceType(com.sundtrack.catan.game.model.enums.ResourceType type) {
        return switch (type) {
            case WOOD -> ResourceTypeDTO.WOOD;
            case BRICK -> ResourceTypeDTO.BRICK;
            case SHEEP -> ResourceTypeDTO.SHEEP;
            case WHEAT -> ResourceTypeDTO.WHEAT;
            case ORE -> ResourceTypeDTO.ORE;
        };
    }

    private TransferResourcesEventDTO createPaymentEvent(String playerId, Map<com.sundtrack.catan.game.model.enums.ResourceType, Integer> cost) {
        Map<ResourceTypeDTO, Integer> costDTO = cost.entrySet().stream()
                .collect(Collectors.toMap(e -> mapResourceType(e.getKey()), Map.Entry::getValue));
        
        int totalCount = cost.values().stream().reduce(0, Integer::sum);

        return new TransferResourcesEventDTO(
                "Server",
                playerId,
                "Bank",
                costDTO,
                totalCount
        );
    }
}