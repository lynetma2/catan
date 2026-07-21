package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.Board;
import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.resource.GameDiscardAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.PlaceRobberAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.game.subFlows.DiscardFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.RoadBuildingFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.RobberPlacementFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.RobberStealFlow;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public class Game {
    private final Board board;
    private final GameFlow flow;
    private final List<TradeOffer> activeTradeOffers;
    private final List<RecordedEvent> gameEvents;
    private final DicePair dicePair;
    private final DevelopmentCardBank developmentCardBank;
    private final ResourceBank resourceBank;
    private final GameConfiguration gameConfiguration;
    private final GameAwards gameAwards;
    private UUID id;
    private List<GamePlayer> players;

    public Game(UUID id, List<GamePlayer> players, Board board, GameFlow flow, List<TradeOffer> activeTradeOffers, List<RecordedEvent> gameEvents, DicePair dicePair, DevelopmentCardBank developmentCardBank, ResourceBank resourceBank, GameConfiguration gameConfiguration) {
        this.id = id;
        this.players = players;
        this.board = board;
        this.flow = flow;
        this.activeTradeOffers = activeTradeOffers;
        this.gameEvents = gameEvents;
        this.dicePair = dicePair;
        this.developmentCardBank = developmentCardBank;
        this.resourceBank = resourceBank;
        this.gameConfiguration = gameConfiguration;
        gameAwards = new GameAwards(gameConfiguration);
    }

    public UUID getId() {
        return id;
    }

    public List<GamePlayer> getPlayers() {
        return players;
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

    public List<Tile> getTiles() {
        return board.getTiles();
    }

    public List<Building<?>> getBuildings() {
        return board.getBuildings();
    }

    public DiceRollDTO getDiceRoll() {
        return dicePair.getDiceRollDTO();
    }

    public RollOutcome rollDice() {
        DiceRollDTO roll = dicePair.roll();
        if (roll.isSeven()) {
            Map<UUID, Integer> required = computeRequiredDiscards();
            flow.startSubFlow(new RobberPlacementFlow()); //Called first as the internals are a stack
            if (!required.isEmpty()) {
                flow.startSubFlow(new DiscardFlow(required));
            }
            return new RollOutcome(roll, Map.of());
        }
        Map<UUID, List<Resource>> granted = grantResourcesForRoll(roll.total());
        flow.enterPostRoll();
        return new RollOutcome(roll, granted);
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

    private Map<UUID, List<Resource>> grantResourcesForRoll(int rollTotal) {
        Map<UUID, List<Resource>> granted = new HashMap<>();
        for (Tile tile : board.tilesProducingOn(rollTotal)) {
            for (Vertex vertex : tile.getAdjacentVertices()) {
                board.getBuildingAt(vertex).ifPresent(building -> {
                    GamePlayer owner = getPlayerOrThrow(building.getOwnerId());
                    int count = building.getKind() == PieceType.CITY ? 2 : 1;
                    List<Resource> drawn = resourceBank.draw(tile.getType().getResourceType(), count);
                    owner.receive(drawn);
                    granted.merge(owner.getId(), drawn, (existing, added) -> {
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

    public void validateCurrentPlayer(UUID playerId) {
        if (!getCurrentPlayerId().equals(playerId)) {
            throw new NotPlayersTurnException(getCurrentPlayerId(), playerId);
        }
    }

    public UUID getCurrentPlayerId() {
        return flow.getCurrentPlayerId();
    }

    public void recordEvent(ClientAction action, EventResult<ServerEvent> resultingEvents, GameContext gameContext) {
        gameEvents.add(new RecordedEvent(action, gameContext, resultingEvents, Instant.now()));
    }

    public GameFlow.TurnAdvanceResult advanceTurn() {
        return flow.advanceTurn();
    }

    public Resource stealResource(RobberStealAction action, UUID retrievingPlayerId) {
        flow.dispatch(action, retrievingPlayerId);
        GamePlayer targetPlayer = getPlayerOrThrow(action.targetPlayerId());
        GamePlayer retrievingPlayer = getPlayerOrThrow(retrievingPlayerId);
        Resource resource = targetPlayer.steal();
        retrievingPlayer.addResource(resource);
        return resource;
    }

    public PlacementResult<Vertex> placeSettlement(PlaceSettlementAction action, UUID playerId) {
        validateAvailableBuildings(PieceType.SETTLEMENT, playerId);
        boolean free = flow.isFreePlacement(PieceType.SETTLEMENT);
        List<Resource> deducted = List.of();

        if (!free) {
            getPlayerOrThrow(playerId).validateCanAfford(PieceType.SETTLEMENT);
        }
        Building<Vertex> settlement = board.placeSettlement(action.target(), playerId, free);
        if (!free) {
            deducted = getPlayerOrThrow(playerId).deduct(PieceType.SETTLEMENT);
            resourceBank.deposit(deducted);
        }

        if (flow.isInSubFlow()) {
            flow.dispatch(action, playerId);
        }
        return new PlacementResult<>(settlement, deducted);
    }

    private void validateAvailableBuildings(PieceType pieceType, UUID playerId) {
        boolean hasAvailableBuilding = switch (pieceType) {
            case ROAD -> board.countRoads(playerId) < gameConfiguration.getMaxNumberOfRoads();
            case SETTLEMENT -> board.countSettlements(playerId) < gameConfiguration.getMaxNumberOfSettlements();
            case CITY -> board.countCities(playerId) < gameConfiguration.getMaxNumberOfCities();
            case DEVELOPMENT_CARD -> false;
        };
        if (!hasAvailableBuilding) {
            throw new NoAvailableBuildingException(pieceType);
        }
    }

    public PlacementResult<Edge> placeRoad(PlaceRoadAction action, UUID playerId) {
        validateAvailableBuildings(PieceType.ROAD, playerId);
        boolean free = flow.isFreePlacement(PieceType.ROAD);
        boolean skipNetworkRule = false;
        List<Resource> deducted = List.of();

        if (!free) {
            getPlayerOrThrow(playerId).validateCanAfford(PieceType.ROAD);
        }
        Building<Edge> road = board.placeRoad(action.target(), playerId, skipNetworkRule);
        if (!free) {
            deducted = getPlayerOrThrow(playerId).deduct(PieceType.ROAD);
            resourceBank.deposit(deducted);
        }

        if (flow.isInSubFlow()) {
            flow.dispatch(action, playerId);
        }
        return new PlacementResult<>(road, deducted);
    }

    public PlacementResult<Vertex> placeCity(Vertex vertex, UUID playerId) {
        validateAvailableBuildings(PieceType.CITY, playerId);
        getPlayerOrThrow(playerId).validateCanAfford(PieceType.CITY);
        Building<Vertex> city = board.upgradeSettlement(vertex, playerId);
        List<Resource> deducted = getPlayerOrThrow(playerId).deduct(PieceType.CITY);
        resourceBank.deposit(deducted);
        return new PlacementResult<>(city, deducted);
    }

    public void placeRobber(PlaceRobberAction action, UUID retrievingPlayerId) {
        flow.dispatch(action, retrievingPlayerId);
        board.moveRobber(action.target());

        List<UUID> candidates = stealActionCandidates(retrievingPlayerId);
        if (!candidates.isEmpty()) {
            flow.startSubFlow(new RobberStealFlow(retrievingPlayerId, candidates));
        }
    }

    private List<UUID> stealActionCandidates(UUID retrievingPlayerId) {
        Set<UUID> stealPlayerIds = board.getAdjacentPlayerIds(board.getRobbedTile().getHex());
        return stealPlayerIds.stream()
                .filter(p -> !p.equals(retrievingPlayerId))
                .filter(p -> getPlayerOrThrow(p).hasResources())
                .toList();
    }

    public List<Resource> discard(GameDiscardAction action, UUID playerId) {
        List<Resource> removed = getPlayerOrThrow(playerId).removeResources(action.discardedResources());
        resourceBank.deposit(removed);
        flow.dispatch(action, playerId);
        return removed;
    }

    public Map<UUID, Integer> getRequiredDiscards() {
        return flow.getActiveDiscardFlow()
                .map(DiscardFlow::getRequiredDiscards)
                .orElse(Map.of());
    }

    public List<UUID> getStealCandidates() {
        return flow.getActiveStealFlow()
                .map(RobberStealFlow::getCandidates)
                .orElse(List.of());
    }

    public boolean isDiscardPending(UUID playerId) {
        return flow.getActiveDiscardFlow()
                .map(discard -> discard.isPending(playerId))
                .orElse(false);
    }

    public int getRequiredDiscardCount(UUID playerId) {
        return flow.getActiveDiscardFlow()
                .map(discard -> discard.getRequiredCount(playerId))
                .orElse(0);
    }

    public Optional<ServerEvent> evaluateEndOfAction() {
        refreshLargestArmy();
        refreshLongestRoadAward();

        for (GamePlayer player : players) {
            long totalVictoryPoints = computeTotalVictoryPoints(player.getId());
            if (totalVictoryPoints >= this.gameConfiguration.getWinScore()) {
                flow.enterGameOver();
                return Optional.of(new GamePhaseChangedEvent(GamePhase.GAME_OVER));
            }
        }
        return Optional.empty();
    }

    public long computeTotalVictoryPoints(UUID playerId) {
        GamePlayer player = getPlayerOrThrow(playerId);
        long points = computePublicVictoryPoints(playerId);
        points += player.getVictoryPointCardCount();
        return points;
    }

    public long computePublicVictoryPoints(UUID playerId) {
        long points = board.countSettlements(playerId) + board.countCities(playerId) * 2;
        if (hasLargestArmy(playerId)) points += 2;
        if (hasLongestRoad(playerId)) points += 2;
        return points;
    }

    public Optional<UUID> getRetrievingPlayerId() {
        return flow.getActiveStealFlow().map(RobberStealFlow::getRetrievingPlayerId);
    }

    public int getRoadsPlaced() {
        return flow.getActiveRoadBuildingFlow()
                .map(RoadBuildingFlow::getRoadsPlaced)
                .orElse(0);
    }

    public int getRoadsRequired() {
        return flow.getActiveRoadBuildingFlow()
                .map(RoadBuildingFlow::getRoadsRequired)
                .orElse(0);
    }

    public boolean hasLargestArmy(UUID playerId) {
        return gameAwards.hasLargestArmy(playerId);
    }

    public boolean hasLongestRoad(UUID playerId) {
        return gameAwards.hasLongestRoad(playerId);
    }

    public DevelopmentCard drawDevelopmentCard(UUID playerId) {
        if (developmentCardBank.isEmpty()) {
            throw new InsufficientDevelopmentCardsException();
        }

        GamePlayer player = getPlayerOrThrow(playerId);
        player.validateCanAfford(PieceType.DEVELOPMENT_CARD);

        List<Resource> deducted = player.deduct(PieceType.DEVELOPMENT_CARD);
        resourceBank.deposit(deducted);

        DevelopmentCard card = developmentCardBank.draw(getTurnNumber());
        player.addDevelopmentCard(card);

        return card;
    }

    private void refreshLargestArmy() {
        gameAwards.refreshLargestArmy(getArmySizes());
    }

    public Map<UUID, Integer> getArmySizes() {
        return players
                .stream()
                .collect(Collectors.toMap(GamePlayer::getId, GamePlayer::getKnightsUsed));
    }

    public void playKnightCard(UUID playerId, UUID cardId) {
        GamePlayer player = getPlayerOrThrow(playerId);
        player.useDevelopmentCard(cardId, DevelopmentCardType.KNIGHT, getTurnNumber());
        player.incrementKnightsUsed();

        flow.startSubFlow(new RobberPlacementFlow());
    }

    public void playRoadBuildingCard(UUID playerId, UUID cardId) {
        getPlayerOrThrow(playerId).useDevelopmentCard(cardId, DevelopmentCardType.ROAD_BUILDING, getTurnNumber());

        int achievable = board.maxPlaceableRoads(playerId, roadSupplyCap(playerId));
        if (achievable > 0) {
            flow.startSubFlow(new RoadBuildingFlow(achievable));
        }
        // achievable == 0: card consumed, no legal placement exists — no flow entered, no phase change.
    }

    public Map<UUID, List<Resource>> playMonopolyCard(UUID playerId, UUID cardId, ResourceType resourceType) {
        GamePlayer player = getPlayerOrThrow(playerId);
        player.useDevelopmentCard(cardId, DevelopmentCardType.MONOPOLY, getTurnNumber());

        Map<UUID, List<Resource>> resultMap = new HashMap<>();

        //Steal the resources.
        for (GamePlayer otherPlayer : players) {
            if (otherPlayer.getId() == playerId) {
                continue;
            }
            List<Resource> removedResources = otherPlayer.removeResourcesOfType(resourceType);
            resultMap.put(otherPlayer.getId(), removedResources);
        }

        //Add the resources
        List<Resource> addedResources = resultMap.values().stream().flatMap(Collection::stream).toList();
        player.addResources(addedResources);

        resultMap.put(playerId, addedResources);
        return resultMap;
    }

    public List<Resource> playYearOfPlentyCard(UUID playerId, UUID cardId, ResourceType type1, ResourceType type2) {
        GamePlayer player = getPlayerOrThrow(playerId);

        int firstResourceAvailable = resourceBank.available(type1);
        if (!(firstResourceAvailable > 0)) {
            throw new InsufficientBankResourcesException(type1, 1, firstResourceAvailable);
        }

        int secondResourceAvailable = resourceBank.available(type2);
        if (!(secondResourceAvailable > 0)) {
            throw new InsufficientBankResourcesException(type2, 1, secondResourceAvailable);
        }

        player.useDevelopmentCard(cardId, DevelopmentCardType.YEAR_OF_PLENTY, getTurnNumber());
        List<Resource> addedResources = new ArrayList<>();
        addedResources.addAll(resourceBank.draw(type1, 1));
        addedResources.addAll(resourceBank.draw(type2, 1));

        player.addResources(addedResources);

        return addedResources;
    }

    private int roadSupplyCap(UUID playerId) {
        long remaining = gameConfiguration.getMaxNumberOfRoads() - board.countRoads(playerId);
        return (int) Math.clamp(remaining, 0, 2);
    }

    private void refreshLongestRoadAward() {
        gameAwards.refreshLongestRoad(getLongestRoadLengths());
    }

    private int roadBuildingAllowance(UUID playerId) {
        long remainingSupply = gameConfiguration.getMaxNumberOfRoads() - board.countRoads(playerId);
        return Math.clamp(remainingSupply, 0, 2);
    }

    public Map<UUID, Integer> getLongestRoadLengths() {
        return players
                .stream()
                .collect(Collectors.toMap(GamePlayer::getId, p -> board.longestRoadLength(p.getId())));
    }

    public record PlacementResult<T>(Building<T> building, List<Resource> deductedResources) {
    }

    public record RollOutcome(DiceRollDTO roll, Map<UUID, List<Resource>> grantedResources) {
    }
}