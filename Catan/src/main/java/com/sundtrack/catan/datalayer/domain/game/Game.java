package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.board.tile.TileKind;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.exceptions.NoRobbedTileException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;

import java.time.Instant;
import java.util.*;

public class Game {
    /**
     * Result of a phase transition that may also cross a turn boundary.
     * {@code turnPassed} tells callers whether TurnEnd/TurnStart events should be emitted;
     * during setup, advancing the phase does not always mean the active player changed
     * (e.g. placing the first road of a turn moves SETUP_PLACE_ROAD -> SETUP_PLACE_SETTLEMENT
     * for the *same* player).
     */
    public record PhaseAdvanceResult(GamePhase newPhase, boolean turnPassed, UUID newCurrentPlayerId) {
    }

    public record TurnAdvanceResult(UUID previousPlayerId, UUID newCurrentPlayerId, int newTurnNumber,
                                    GamePhase initialPhase) {
    }

    public record SevenRolledAdvanceResult(GamePhase gamephase, Optional<DiscardSession> discardSession) {
    }

    private UUID id;
    private List<GamePlayer> players;
    private List<Tile> tiles;
    private List<Building<?>> buildings;
    private GamePhase currentPhase;
    private Integer turnNumber;
    private List<TradeOffer> activeTradeOffers;
    private List<RecordedEvent> gameEvents;
    private TurnOrder turnOrder;
    private DicePair dicePair;
    private DiscardSession discardSession;

    public Game(UUID id, List<GamePlayer> players, List<Tile> tiles, List<Building<?>> buildings, GamePhase currentPhase, Integer turnNumber, List<TradeOffer> activeTradeOffers, List<RecordedEvent> gameEvents, TurnOrder turnOrder, DicePair dicePair) {
        this.id = id;
        this.players = players;
        this.tiles = tiles;
        this.buildings = buildings;
        this.currentPhase = currentPhase;
        this.turnNumber = turnNumber;
        this.activeTradeOffers = activeTradeOffers;
        this.gameEvents = gameEvents;
        this.turnOrder = turnOrder;
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

    public List<Tile> getTiles() {
        return tiles;
    }

    public void setTiles(List<Tile> tiles) {
        this.tiles = tiles;
    }

    public List<Building<?>> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<Building<?>> buildings) {
        this.buildings = buildings;
    }

    public GamePhase getCurrentPhase() {
        return currentPhase;
    }

    public void setCurrentPhase(GamePhase currentPhase) {
        this.currentPhase = currentPhase;
    }

    public Integer getTurnNumber() {
        return turnNumber;
    }

    public void setTurnNumber(Integer turnNumber) {
        this.turnNumber = turnNumber;
    }

    public List<TradeOffer> getActiveTradeOffers() {
        return activeTradeOffers;
    }

    public void setActiveTradeOffers(List<TradeOffer> activeTradeOffers) {
        this.activeTradeOffers = activeTradeOffers;
    }

    public List<RecordedEvent> getGameEvents() {
        return gameEvents;
    }

    public void setGameEvents(List<RecordedEvent> gameEvents) {
        this.gameEvents = gameEvents;
    }

    public void validateBoardSettlement(Vertex vertex, UUID playerId) {
        // 1. Check that the vertex is free
        if (isVertexOccupied(vertex)) {
            throw new VertexOccupiedException(vertex);
        }

        // 2. Distance rule: no building on any adjacent vertex
        if (isAnyAdjacentVertexOccupied(vertex)) {
            throw new DistanceRuleException(vertex);
        }

        // 3. Connected road rule (skipped during setup)
        if (!currentPhase.isSetupPhase() && !isVertexConnectedToPlayerRoad(vertex, playerId)) {
            throw new NoConnectedRoadException(vertex, playerId);
        }
    }

    public void validateBoardCity(Vertex vertex, UUID playerId) {
        // 1. There must be a settlement at this vertex...
        Building<?> existing = getBuildingAt(vertex)
                .orElseThrow(() -> new NoSettlementToUpgradeException(vertex));

        // 2. ...owned by this player...
        if (!existing.getOwnerId().equals(playerId)) {
            throw new NotOwnerException(vertex, playerId);
        }

        // 3. ...and it must actually be a settlement, not already a city
        if (existing.getKind() != PieceType.SETTLEMENT) {
            throw new AlreadyCityException(vertex, existing);
        }
    }

    public void validateBoardRoad(Edge edge, UUID playerId) {
        // 1. Edge must be free
        if (isEdgeOccupied(edge)) {
            throw new EdgeOccupiedException(edge);
        }

        // 2. Connection rule: road must be linked to the player's existing network
        if (!currentPhase.isSetupPhase() && !isEdgeConnectedToPlayerNetwork(edge, playerId)) {
            throw new NoConnectedRoadException(edge, playerId);
        }
    }

    public void validateBoardRobber(Hex hex) {
        Tile tile = getTileAt(hex);

        if (tile.hasRobber()) {
            throw new TileAlreadyRobbedException(tile);
        }

        if (tile.getKind().equals(TileKind.SEA)) {
            throw new InvalidHexException(hex);
        }
    }

    public void validateCanAfford(PieceType pieceType, UUID playerId) {
        if (currentPhase.isSetupPhase()) {
            return; // free placement during setup
        }
        getPlayerOrThrow(playerId).validateCanAfford(pieceType);
    }

    public List<Resource> deduct(PieceType pieceType, UUID playerId) {
        if (currentPhase.isSetupPhase()) {
            return List.of();
        }
        return getPlayerOrThrow(playerId).deduct(pieceType);
    }

    public Building<Vertex> addSettlement(Vertex vertex, UUID playerId) {
        Building<Vertex> settlement = Building.settlement(playerId, vertex);
        buildings.add(settlement);
        return settlement;
    }

    public Building<Edge> addRoad(Edge edge, UUID playerId) {
        Building<Edge> road = Building.road(playerId, edge);
        buildings.add(road);
        return road;
    }

    public Building<Vertex> addCity(Vertex vertex, UUID playerId) {
        Building<Vertex> city = Building.city(playerId, vertex);
        buildings.add(city);
        return city;
    }

    public void moveRobber(Hex target) {
        Tile robbedTile = getRobbedTile();
        robbedTile.removeRobber();
        Tile newRobbedTile = getTileAt(target);
        newRobbedTile.setRobbed();
    }

    public UUID getCurrentPlayerId() {
        return turnOrder.currentPlayerId();
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

    public void validateRobberStealTargetPlayer(UUID targetPlayerId) {
        Tile robbedTile = getRobbedTile();
        Set<UUID> players = getAdjacentPlayerIds(robbedTile.getHex());
        if (!players.contains(targetPlayerId)) {
            throw new InvalidStealTargetException(targetPlayerId);
        }
    }

    public Optional<GamePhase> advancePhaseAfterSettlement() {
        if (currentPhase != GamePhase.SETUP_PLACE_SETTLEMENT) {
            return Optional.empty(); // settlements outside setup don't change phase
        }
        currentPhase = GamePhase.SETUP_PLACE_ROAD;
        return Optional.of(currentPhase);
    }

    public Optional<PhaseAdvanceResult> advancePhaseAfterRoad() {
        if (currentPhase != GamePhase.SETUP_PLACE_ROAD) {
            return Optional.empty();
        }

        TurnOrder.SetupAdvanceResult advanceResult = turnOrder.advanceSetup();

        currentPhase = switch (advanceResult) {
            case SETUP_COMPLETE -> GamePhase.PRE_ROLL;
            case SAME_PLAYER_AGAIN, NEXT_PLAYER -> GamePhase.SETUP_PLACE_SETTLEMENT;
        };

        boolean turnPassed = advanceResult != TurnOrder.SetupAdvanceResult.SAME_PLAYER_AGAIN;

        return Optional.of(new PhaseAdvanceResult(currentPhase, turnPassed, turnOrder.currentPlayerId()));
    }

    public GamePhase advancePhaseAfterEndTurn() {
        return GamePhase.PRE_ROLL;
    }

    public void recordEvent(ClientAction action, EventResult<ServerEvent> resultingEvents, GameContext gameContext) {
        gameEvents.add(new RecordedEvent(action, gameContext, resultingEvents, Instant.now()));
    }

    public Map<UUID, List<Resource>> grantResourcesForRoll(int rollTotal) {
        Map<UUID, List<Resource>> granted = new HashMap<>();

        for (Tile tile : tiles) {
            if (tile.getNumber() == null || !tile.getNumber().equals(rollTotal) || tile.hasRobber()) {
                continue;
            }
            for (Vertex vertex : tile.getAdjacentVertices()) {
                buildings.stream()
                        .filter(b -> b.getLocation().equals(vertex))
                        .findFirst()
                        .ifPresent(building -> {
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

    public GamePhase advancePhaseAfterGrantResources() {
        GamePhase gamePhase = GamePhase.POST_ROLL;
        this.setCurrentPhase(gamePhase);
        return gamePhase;
    }

    public SevenRolledAdvanceResult advancePhaseAfterSevenRoll() {
        GamePhase gamePhase = GamePhase.ROBBER_PLACEMENT;
        this.setCurrentPhase(gamePhase);
        computeAndSetRequiredDiscards(this.players);
        return new SevenRolledAdvanceResult(gamePhase, Optional.of(this.discardSession));
    }

    public GamePhase advancePhaseAfterRobberPlacement(UUID retrievingPlayerId) {
        GamePhase gamePhase = GamePhase.POST_ROLL;
        if (stealActionPossible(retrievingPlayerId)) {
            gamePhase = GamePhase.ROBBER_STEAL;
        }
        this.setCurrentPhase(gamePhase);
        return gamePhase;
    }

    public GamePhase advancePhaseAfterRobberSteal() {
        GamePhase gamePhase = GamePhase.POST_ROLL;
        this.setCurrentPhase(gamePhase);
        return gamePhase;
    }

    public TurnAdvanceResult advanceTurn() {
        UUID previousPlayerId = turnOrder.currentPlayerId();
        turnOrder.advance();
        turnNumber++;
        currentPhase = GamePhase.PRE_ROLL;
        return new TurnAdvanceResult(previousPlayerId, turnOrder.currentPlayerId(), turnNumber, currentPhase);
    }

    public Resource stealResource(UUID targetPlayerId, UUID retrievingPlayerId) {
        GamePlayer targetPlayer = getPlayerOrThrow(targetPlayerId);
        GamePlayer retrievingPlayer = getPlayerOrThrow(retrievingPlayerId);

        Resource resource = targetPlayer.steal();
        retrievingPlayer.addResource(resource);
        return resource;
    }

    public Set<UUID> getAdjacentPlayerIds(Hex target) {
        Set<UUID> adjacentPlayerIds = new HashSet<>();
        Tile tile = getTileAt(target);
        List<Vertex> adjacentVertices = tile.getAdjacentVertices();
        for (Vertex vertex : adjacentVertices) {
            Optional<Building<?>> building = getBuildingAt(vertex);
            building.ifPresent(vertexBuilding -> adjacentPlayerIds.add(vertexBuilding.getOwnerId()));
        }
        return adjacentPlayerIds;
    }

    public Optional<DiscardSession> getDiscardSession() {
        return Optional.ofNullable(discardSession);
    }

    public void setDiscardSession(DiscardSession discardSession) {
        this.discardSession = discardSession;
    }

    private GamePlayer getPlayerOrThrow(UUID playerId) {
        return players.stream()
                .filter(p -> p.getId().equals(playerId))
                .findFirst()
                .orElseThrow(() -> new PlayerNotFoundException(playerId));
    }

    private boolean isVertexOccupied(Vertex vertex) {
        return getBuildingAt(vertex).isPresent();
    }

    private Optional<Building<?>> getBuildingAt(Vertex vertex) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Vertex)
                .filter(b -> b.getLocation().equals(vertex))
                .findFirst();
    }

    private boolean isAnyAdjacentVertexOccupied(Vertex vertex) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Vertex)
                .map(b -> (Vertex) b.getLocation())
                .anyMatch(vertex::isAdjacentTo);
    }

    private boolean isVertexConnectedToPlayerRoad(Vertex vertex, UUID playerId) {
        // A road (edge) is adjacent to a vertex if the vertex's hexes include the edge's two hexes
        return buildings.stream()
                .filter(b -> b.getOwnerId().equals(playerId))
                .filter(b -> b.getLocation() instanceof Edge)
                .map(b -> (Edge) b.getLocation())
                .anyMatch(edge -> edge.isAdjacentTo(vertex));
    }

    private boolean isEdgeOccupied(Edge edge) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Edge)
                .anyMatch(b -> b.getLocation().equals(edge));
    }

    private boolean isEdgeConnectedToPlayerNetwork(Edge edge, UUID playerId) {
        List<Vertex> endpoints = edge.getVertices(); // the two vertices at the ends of this edge

        return buildings.stream()
                .filter(b -> b.getOwnerId().equals(playerId))
                .anyMatch(building -> {
                    // a settlement/city on one of the endpoints
                    if (building.getLocation() instanceof Vertex v && endpoints.contains(v)) {
                        return true;
                    }
                    // another road that shares a vertex with this edge
                    if (building.getLocation() instanceof Edge otherEdge) {
                        List<Vertex> otherEndpoints = otherEdge.getVertices();
                        for (Vertex ep : endpoints) {
                            if (otherEndpoints.contains(ep)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
    }

    private Tile getTileAt(Hex hex) {
        return tiles
                .stream()
                .filter(tile -> tile.getHex().equals(hex))
                .findFirst()
                .orElseThrow(() -> new NoTileOnHexException(hex));
    }

    private Tile getRobbedTile() {
        return tiles
                .stream()
                .filter(Tile::hasRobber)
                .findFirst()
                .orElseThrow(() -> new NoRobbedTileException("Called inside getRobbedTile"));
    }

    private boolean stealActionPossible(UUID retrievingPlayerId) {
        Set<UUID> playerIds = getAdjacentPlayerIds(getRobbedTile().getHex());
        return playerIds
                .stream()
                .filter(p -> !p.equals(retrievingPlayerId))
                .anyMatch(p -> getPlayerOrThrow(p).hasResources());
    }

    private void computeAndSetRequiredDiscards(List<GamePlayer> players) {
        Map<UUID, Integer> map = new HashMap<>();
        for (GamePlayer p : players) {
            int total = p.getResourceCount();
            if (total > 7) {
                map.put(p.getId(), total / 2);
            }
        }
        discardSession = new DiscardSession(map);
    }
}
