package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.Board;
import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InvalidStealTargetException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.NotPlayersTurnException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.PlayerNotFoundException;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;

import java.time.Instant;
import java.util.*;

public class Game {
    private final Board board;
    private final GameFlow flow;
    private final List<TradeOffer> activeTradeOffers;
    private final List<RecordedEvent> gameEvents;
    private final DicePair dicePair;
    private UUID id;
    private List<GamePlayer> players;

    public Game(UUID id, List<GamePlayer> players, Board board, GameFlow flow, List<TradeOffer> activeTradeOffers, List<RecordedEvent> gameEvents, DicePair dicePair) {
        this.id = id;
        this.players = players;
        this.board = board;
        this.flow = flow;
        this.activeTradeOffers = activeTradeOffers;
        this.gameEvents = gameEvents;
        this.dicePair = dicePair;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<GamePlayer> getPlayers() {
        return players;
    }

    public void setPlayers(List<GamePlayer> players) {
        this.players = players;
    }

    public GamePhase getCurrentPhase() {
        return flow.getCurrentPhase();
    }

    public Integer getTurnNumber() {
        return flow.getTurnNumber();
    }

    public List<TradeOffer> getActiveTradeOffers() {
        return activeTradeOffers;
    }

    public DiscardSession getDiscardSession() {
        return flow.getDiscardSession();
    }

    public StealSession getStealSession() {
        return flow.getStealSession();
    }

    public List<Tile> getTiles() {
        return board.getTiles();
    }

    public List<Building<?>> getBuildings() {
        return board.getBuildings();
    }

    public void moveRobber(Hex target) {
        board.moveRobber(target);
    }

    public DiceRollDTO getDiceRoll() {
        return dicePair.getDiceRollDTO();
    }

    public DiceRollDTO rollDices() {
        return dicePair.roll();
    }

    public void validateCurrentPlayer(UUID playerId) {
        if (!getCurrentPlayerId().equals(playerId)) {
            throw new NotPlayersTurnException(getCurrentPlayerId(), playerId);
        }
    }

    public UUID getCurrentPlayerId() {
        return flow.getCurrentPlayerId();
    }

    public Optional<GamePhase> advancePhaseAfterSettlement() {
        return flow.advanceAfterSettlement();
    }

    public Optional<GameFlow.PhaseAdvanceResult> advancePhaseAfterRoad() {
        return flow.advanceAfterRoad();
    }

    public GamePhase advancePhaseAfterEndTurn() {
        return flow.advanceAfterEndTurn();
    }

    public void recordEvent(ClientAction action, EventResult<ServerEvent> resultingEvents, GameContext gameContext) {
        gameEvents.add(new RecordedEvent(action, gameContext, resultingEvents, Instant.now()));
    }

    public Map<UUID, List<Resource>> grantResourcesForRoll(int rollTotal) {
        Map<UUID, List<Resource>> granted = new HashMap<>();
        for (Tile tile : board.tilesProducingOn(rollTotal)) {
            for (Vertex vertex : tile.getAdjacentVertices()) {
                board.getBuildingAt(vertex).ifPresent(building -> {
                    GamePlayer owner = getPlayerOrThrow(building.getOwnerId());
                    int count = building.getKind() == PieceType.CITY ? 2 : 1;
                    List<Resource> resources = owner.grant(tile.getType().getResourceType(), count);
                    granted.merge(owner.getId(), resources, (existing, added) -> {
                        existing.addAll(added);
                        return existing;
                    });
                });
            }
        }
        return granted;
    }

    private GamePlayer getPlayerOrThrow(UUID playerId) {
        return players.stream()
                .filter(p -> p.getId().equals(playerId))
                .findFirst()
                .orElseThrow(() -> new PlayerNotFoundException(playerId));
    }

    public GamePhase advancePhaseAfterGrantResources() {
        return flow.advanceAfterGrantResources();
    }

    public GameFlow.SevenRolledAdvanceResult advancePhaseAfterSevenRoll() {
        return flow.advanceAfterSevenRoll(computeRequiredDiscards());
    }

    private Map<UUID, Integer> computeRequiredDiscards() {
        Map<UUID, Integer> required = new HashMap<>();
        for (GamePlayer p : players) {
            int total = p.getResourceCount();
            if (total > 7) {
                required.put(p.getId(), total / 2);
            }
        }
        return required;
    }

    public GameFlow.RobberPlacedAdvanceResult advancePhaseAfterRobberPlacement(UUID retrievingPlayerId) {
        return flow.advanceAfterRobberPlacement(retrievingPlayerId, stealActionCandidates(retrievingPlayerId));
    }

    private List<UUID> stealActionCandidates(UUID retrievingPlayerId) {
        Set<UUID> stealPlayerIds = board.getAdjacentPlayerIds(board.getRobbedTile().getHex());
        return stealPlayerIds.stream()
                .filter(p -> !p.equals(retrievingPlayerId))
                .filter(p -> getPlayerOrThrow(p).hasResources())
                .toList();
    }

    public GamePhase advancePhaseAfterRobberSteal() {
        return flow.advanceAfterRobberSteal();
    }

    public GameFlow.TurnAdvanceResult advanceTurn() {
        return flow.advanceTurn();
    }

    public Resource stealResource(UUID targetPlayerId, UUID retrievingPlayerId) {
        validateRobberStealTargetPlayer(targetPlayerId);
        GamePlayer targetPlayer = getPlayerOrThrow(targetPlayerId);
        GamePlayer retrievingPlayer = getPlayerOrThrow(retrievingPlayerId);
        Resource resource = targetPlayer.steal();
        retrievingPlayer.addResource(resource);
        return resource;
    }

    private void validateRobberStealTargetPlayer(UUID targetPlayerId) {
        Set<UUID> players = board.getAdjacentPlayerIds(board.getRobbedTile().getHex());
        if (!players.contains(targetPlayerId)) {
            throw new InvalidStealTargetException(targetPlayerId);
        }
    }

    public PlacementResult<Vertex> placeSettlement(Vertex vertex, UUID playerId) {
        boolean isSetup = flow.isSetupPhase();
        List<Resource> deducted = List.of();
        if (!isSetup) {
            getPlayerOrThrow(playerId).validateCanAfford(PieceType.SETTLEMENT);
        }
        Building<Vertex> settlement = board.placeSettlement(vertex, playerId, isSetup);
        if (!isSetup) {
            deducted = getPlayerOrThrow(playerId).deduct(PieceType.SETTLEMENT);
        }
        return new PlacementResult<>(settlement, deducted);
    }

    public PlacementResult<Edge> placeRoad(Edge edge, UUID playerId) {
        boolean isSetup = flow.isSetupPhase();
        List<Resource> deducted = List.of();
        if (!isSetup) {
            getPlayerOrThrow(playerId).validateCanAfford(PieceType.ROAD);
        }
        Building<Edge> road = board.placeRoad(edge, playerId, isSetup);
        if (!isSetup) {
            deducted = getPlayerOrThrow(playerId).deduct(PieceType.ROAD);
        }
        return new PlacementResult<>(road, deducted);
    }

    public PlacementResult<Vertex> placeCity(Vertex vertex, UUID playerId) {
        getPlayerOrThrow(playerId).validateCanAfford(PieceType.CITY);
        Building<Vertex> city = board.placeCity(vertex, playerId);
        List<Resource> deducted = getPlayerOrThrow(playerId).deduct(PieceType.CITY);
        return new PlacementResult<>(city, deducted);
    }

    public record PlacementResult<T>(Building<T> building, List<Resource> deductedResources) {
    }
}