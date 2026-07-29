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
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

public class Game {
    private final Board board;
    private final GameFlow flow;
    private final TradeBook tradeBook;
    private final List<RecordedEvent> gameEvents;
    private final DicePair dicePair;
    private final DevelopmentCardBank developmentCardBank;
    private final ResourceBank resourceBank;
    private final GameConfiguration gameConfiguration;
    private final GameAwards gameAwards;
    private final UUID id;
    private final List<GamePlayer> players;

    public Game(UUID id, List<GamePlayer> players, Board board, GameFlow flow, TradeBook tradeBook, List<RecordedEvent> gameEvents, DicePair dicePair, DevelopmentCardBank developmentCardBank, ResourceBank resourceBank, GameConfiguration gameConfiguration) {
        this.id = id;
        this.players = players;
        this.board = board;
        this.flow = flow;
        this.tradeBook = tradeBook;
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

    public List<TradeOffer> getActiveTradeOffers() {
        return tradeBook.getActiveOffers();
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
        flow.enterPostRoll();
        if (roll.isSeven()) {
            Map<UUID, Integer> required = computeRequiredDiscards();
            flow.startSubFlow(new RobberPlacementFlow()); //Called first as the internals are a stack
            if (!required.isEmpty()) {
                flow.startSubFlow(new DiscardFlow(required));
            }
            return new RollOutcome(roll, Map.of());
        }
        Map<UUID, List<Resource>> granted = grantResourcesForRoll(roll.total());
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
        boolean isSecondSetupSettlement = free && flow.isFinalSetupRound();

        List<Resource> deducted = List.of();

        if (!free) {
            getPlayerOrThrow(playerId).validateCanAfford(PieceType.SETTLEMENT);
        }
        Building<Vertex> settlement = board.placeSettlement(action.target(), playerId, free);
        if (!free) {
            deducted = getPlayerOrThrow(playerId).deduct(PieceType.SETTLEMENT);
            resourceBank.deposit(deducted);
        }

        List<Resource> starterResources = List.of();
        if (isSecondSetupSettlement) {
            starterResources = grantStarterResources(action.target(), playerId);
        }

        if (flow.isInSubFlow()) {
            flow.dispatch(action, playerId);
        }
        return new PlacementResult<>(settlement, deducted, starterResources);
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

    private List<Resource> grantStarterResources(Vertex settlementVertex, UUID playerId) {
        List<ResourceType> types = board.adjacentResourceTypes(settlementVertex);
        List<Resource> granted = new ArrayList<>();
        for (ResourceType type : types) {
            granted.addAll(resourceBank.draw(type, 1));
        }
        getPlayerOrThrow(playerId).receive(granted);
        return granted;
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
        List<Resource> removed = getPlayerOrThrow(playerId).removeResourcesById(action.discardedResources());
        resourceBank.deposit(removed);
        flow.dispatch(action, playerId);
        return removed;
    }

    public Map<UUID, Integer> getPendingRequiredDiscards() {
        return flow.getActiveDiscardFlow()
                .map(DiscardFlow::getPendingRequireDiscards)
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

    private void refreshLargestArmy() {
        gameAwards.refreshLargestArmy(getArmySizes());
    }

    private void refreshLongestRoadAward() {
        gameAwards.refreshLongestRoad(getLongestRoadLengths());
    }

    public long computeTotalVictoryPoints(UUID playerId) {
        GamePlayer player = getPlayerOrThrow(playerId);
        long points = computePublicVictoryPoints(playerId);
        points += player.getVictoryPointCardCount();
        return points;
    }

    public Map<UUID, Integer> getArmySizes() {
        return players
                .stream()
                .collect(Collectors.toMap(GamePlayer::getId, GamePlayer::getKnightsUsed));
    }

    public Map<UUID, Integer> getLongestRoadLengths() {
        return players
                .stream()
                .collect(Collectors.toMap(GamePlayer::getId, p -> board.longestRoadLength(p.getId())));
    }

    public long computePublicVictoryPoints(UUID playerId) {
        long points = board.countSettlements(playerId) + board.countCities(playerId) * 2;
        if (hasLargestArmy(playerId)) points += 2;
        if (hasLongestRoad(playerId)) points += 2;
        return points;
    }

    public boolean hasLargestArmy(UUID playerId) {
        return gameAwards.hasLargestArmy(playerId);
    }

    public boolean hasLongestRoad(UUID playerId) {
        return gameAwards.hasLongestRoad(playerId);
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

    public Integer getTurnNumber() {
        return flow.getTurnNumber();
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

    private int roadSupplyCap(UUID playerId) {
        long remaining = gameConfiguration.getMaxNumberOfRoads() - board.countRoads(playerId);
        return (int) Math.clamp(remaining, 0, 2);
    }

    public Map<UUID, List<Resource>> playMonopolyCard(UUID playerId, UUID cardId, ResourceType resourceType) {
        GamePlayer player = getPlayerOrThrow(playerId);
        player.useDevelopmentCard(cardId, DevelopmentCardType.MONOPOLY, getTurnNumber());

        Map<UUID, List<Resource>> resultMap = new HashMap<>();

        //Steal the resources.
        for (GamePlayer otherPlayer : players) {
            if (Objects.equals(otherPlayer.getId(), playerId)) {
                continue;
            }
            List<Resource> removedResources = otherPlayer.removeAllResourcesOfType(resourceType);
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

    private int roadBuildingAllowance(UUID playerId) {
        long remainingSupply = gameConfiguration.getMaxNumberOfRoads() - board.countRoads(playerId);
        return Math.clamp(remainingSupply, 0, 2);
    }

    public List<Resource> bankTrade(UUID playerId, List<Resource> given, List<ResourceType> wanted) {
        GamePlayer player = getPlayerOrThrow(playerId);

        if (given.isEmpty() || wanted.isEmpty()) {
            throw new GivenResourcesWrongTradeException();
        }

        if (!player.ownsResources(given)) {
            throw new InsufficientResourcesException(playerId, given);
        }

        // Verify the bank can provide all requested resources.
        for (ResourceType wantedType : wanted) {
            if (!resourceBank.isAvailable(wantedType, 1)) {
                throw new InsufficientBankResourcesException(wantedType, 1);
            }
        }

        // Create mutable pools of resources by type.
        Map<ResourceType, Deque<Resource>> pools = given.stream()
                .collect(Collectors.groupingBy(
                        Resource::resourceType,
                        Collectors.toCollection(ArrayDeque::new)
                ));

        // Simulate each trade by consuming resources from one pool.
        for (ResourceType wantedType : wanted) {
            int ratio = board.getBestTradeRatio(playerId, wantedType);

            Deque<Resource> pool = pools.entrySet().stream()
                    .filter(entry -> entry.getKey() != wantedType)
                    .filter(entry -> entry.getValue().size() >= ratio)
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .orElseThrow(GivenResourcesWrongTradeException::new);

            for (int i = 0; i < ratio; i++) {
                pool.removeFirst();
            }
        }

        // Perform the trade.
        player.removeResources(given);

        List<Resource> received = new ArrayList<>();
        for (ResourceType wantedType : wanted) {
            received.addAll(resourceBank.draw(wantedType, 1));
        }

        player.addResources(received);

        return received;
    }

    public TradeOffer startTrade(UUID playerId, List<Resource> offered, List<ResourceType> wanted) {
        GamePlayer player = getPlayerOrThrow(playerId);
        if (!player.ownsResources(offered)) {
            throw new InsufficientResourcesException(playerId, offered);
        }

        List<UUID> otherPlayerIds = this.players.
                stream()
                .map(GamePlayer::getId)
                .filter(p -> !p.equals(playerId))
                .toList();

        return tradeBook.start(playerId, offered, wanted, otherPlayerIds);
    }

    public void respondToTrade(UUID playerId, UUID tradeOfferId, TradeOfferResponseKind kind) {
        switch (kind) {
            case TradeOfferResponseKind.ACCEPT -> {
                List<ResourceType> wanted = tradeBook.getWantedResourceTypes(tradeOfferId);
                getPlayerOrThrow(playerId).ownsResourcesOfTypeOrThrow(wanted);
                tradeBook.addAcceptResponse(tradeOfferId, playerId);
            }
            case TradeOfferResponseKind.DECLINE -> tradeBook.addDeclineResponse(tradeOfferId, playerId);
        }
    }

    public void cancelTradeOffer(UUID playerId, UUID tradeOfferId) {
        tradeBook.cancel(tradeOfferId, playerId);
    }

    public TradeBook.TradeTerms confirmTrade(UUID playerId, UUID respondentId, UUID tradeOfferId) {
        List<Resource> offeredResources = tradeBook.getOfferedResources(tradeOfferId);
        GamePlayer initiator = getPlayerOrThrow(playerId);
        GamePlayer respondent = getPlayerOrThrow(respondentId);

        //Validate accepted player still has the resources
        initiator.ownsResources(offeredResources);
        //Validate initiator still has the resources
        respondent.ownsResourcesOfTypeOrThrow(tradeBook.getWantedResourceTypes(tradeOfferId));

        //Remove the resources
        initiator.removeResources(offeredResources);
        List<Resource> wantedResources = respondent.removeGivenTypes(tradeBook.getWantedResourceTypes(tradeOfferId));

        //Add the resources
        respondent.addResources(offeredResources);
        initiator.addResources(wantedResources);

        tradeBook.confirm(tradeOfferId, playerId, respondentId);

        return new TradeBook.TradeTerms(offeredResources, wantedResources);
    }

    public record PlacementResult<T>(Building<T> building, List<Resource> deductedResources,
                                     List<Resource> grantedResources) {
        public PlacementResult(Building<T> building, List<Resource> deductedResources) {
            this(building, deductedResources, List.of());
        }
    }

    public record RollOutcome(DiceRollDTO roll, Map<UUID, List<Resource>> grantedResources) {
    }
}