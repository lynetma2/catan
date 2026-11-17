
package com.sundtrack.catan.game.persistence;

import com.sundtrack.catan.game.domain.*;
import com.sundtrack.catan.game.domain.board.Board;
import com.sundtrack.catan.game.domain.board.Edge;
import com.sundtrack.catan.game.domain.board.Hex;
import com.sundtrack.catan.game.domain.board.Vertex;
import com.sundtrack.catan.game.domain.board.tile.*;
import com.sundtrack.catan.game.domain.building.Building;
import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.game.domain.exceptions.NoRobbedTileException;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.subFlows.*;
import com.sundtrack.catan.game.domain.trade.TradeOffer;
import com.sundtrack.catan.game.domain.trade.TradeOfferResponseKind;
import com.sundtrack.catan.game.persistence.state.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
class GameStateCodec {

    public GameStateDocument toDocument(Game game) {
        return new GameStateDocument(
                GameStateDocument.CURRENT_SCHEMA_VERSION,
                game.getId(),
                game.getPlayers().stream()
                        .map(this::toPlayerDocument)
                        .toList(),
                toBoardDocument(game.getBoard()),
                toFlowDocument(game.getFlow(), game.getTurnOrder()),
                game.getTradeBook().getActiveOffers().stream()
                        .map(this::toTradeOfferDocument)
                        .toList(),
                toDiceDocument(game.getDicePair()),
                game.getDevelopmentCardBank().getRemainingDeck().stream()
                        .map(DevelopmentCardType::name)
                        .toList(),
                toResourceBankMap(game.getResourceBank()),
                toAwardsDocument(game.getGameAwards())
        );
    }

    public Game toGame(GameStateDocument document) {
        GameConfiguration config = GameConfiguration.standard();

        TurnOrder turnOrder = toTurnOrder(document.flow().turnOrder());

        Deque<SubFlow> flows = document.flow().activeFlows().stream()
                .map(flow -> toSubFlow(flow, turnOrder))
                .collect(Collectors.toCollection(ArrayDeque::new));

        GameFlow gameFlow = GameFlow.restore(
                turnOrder,
                GamePhase.valueOf(document.flow().basePhase()),
                document.flow().turnNumber(),
                flows
        );

        Board board = toBoard(document.board());

        TradeBook tradeBook = new TradeBook(
                document.tradeOffers().stream()
                        .map(this::toTradeOffer)
                        .toList()
        );

        DevelopmentCardBank devBank = new DevelopmentCardBank(
                document.devDeck().stream()
                        .map(DevelopmentCardType::valueOf)
                        .collect(Collectors.toCollection(ArrayDeque::new))
        );

        ResourceBank resBank = new ResourceBank(
                toResourceBank(document.resourceBank())
        );

        GameAwards awards = toAwards(document.awards(), config);

        DicePair dice = toDicePair(document.dice());

        return Game.restore(
                document.gameId(),
                document.players().stream()
                        .map(this::toPlayer)
                        .toList(),
                board,
                gameFlow,
                tradeBook,
                dice,
                devBank,
                resBank,
                config,
                awards
        );
    }

    // -------------------------------------------------------------------------
    // Domain -> Persistence
    // -------------------------------------------------------------------------

    private PlayerStateDocument toPlayerDocument(GamePlayer player) {
        return new PlayerStateDocument(
                player.getId(),
                player.getUsername(),
                player.getColor(),
                player.getDevelopmentCards().stream()
                        .map(this::toDevelopmentCardDocument)
                        .toList(),
                player.getResources().stream()
                        .map(this::toResourceDocument)
                        .toList(),
                player.getKnightsUsed()
        );
    }

    private DicePairStateDocument toDiceDocument(DicePair pair) {
        DiceRoll last = pair.getDiceRoll();
        int[] lastRoll = last != null ? new int[]{last.die1(), last.die2()} : null;
        return new DicePairStateDocument(pair.getSeed(), pair.getRollCount(), lastRoll);
    }

    private ResourceStateDocument toResourceDocument(Resource resource) {
        return new ResourceStateDocument(
                resource.uid(),
                resource.resourceType().name()
        );
    }

    private DevelopmentCardStateDocument toDevelopmentCardDocument(
            DevelopmentCard card
    ) {
        return new DevelopmentCardStateDocument(
                card.getId(),
                card.getType().name(),
                card.getPurchasedOnTurn()
        );
    }

    private TileStateDocument toTileDocument(Tile tile) {
        return new TileStateDocument(
                tile.getHex().q(),
                tile.getHex().r(),
                tile.getKind().name(),
                tile.getType().name(),
                tile.getNumber(),
                tile.getPortType() != null
                        ? tile.getPortType().name()
                        : null,
                tile.getPortFacing()
        );
    }

    private BuildingStateDocument toBuildingDocument(Building<?> building) {
        List<HexStateDocument> hexes = switch (building.getLocation()) {
            case Vertex(List<Hex> vertexHexes) -> vertexHexes.stream()
                    .map(this::toHexDocument)
                    .toList();

            case Edge edge -> edge.hexes().stream()
                    .map(this::toHexDocument)
                    .toList();

            default -> throw new IllegalStateException(
                    "Unknown building location type: "
                            + building.getLocation().getClass()
            );
        };

        return new BuildingStateDocument(
                building.getId().toString(),
                building.getKind().name(),
                building.getOwnerId().toString(),
                hexes
        );
    }

    private HexStateDocument toHexDocument(Hex hex) {
        return new HexStateDocument(hex.q(), hex.r());
    }

    private BoardStateDocument toBoardDocument(Board board) {
        List<TileStateDocument> tiles = board.getTiles().stream()
                .map(this::toTileDocument)
                .toList();

        List<BuildingStateDocument> buildings = board.getBuildings().stream()
                .map(this::toBuildingDocument)
                .toList();

        HexStateDocument robberPosition = null;

        try {
            Tile robbedTile = board.getRobbedTile();
            robberPosition = toHexDocument(robbedTile.getHex());
        } catch (NoRobbedTileException ignored) {
            // No robber placed yet.
        }

        return new BoardStateDocument(
                tiles,
                buildings,
                robberPosition
        );
    }

    private FlowStateDocument toFlowDocument(
            GameFlow flow,
            TurnOrder turnOrder
    ) {
        return new FlowStateDocument(
                new TurnOrderDocument(
                        turnOrder.getPlayerIds(),
                        turnOrder.getCurrentIndex(),
                        turnOrder.isReversed()
                ),
                flow.getBasePhase().name(),
                flow.getTurnNumber(),
                flow.getActiveFlows().stream()
                        .map(this::toSubFlowDocument)
                        .toList()
        );
    }

    private SubFlowStateDocument toSubFlowDocument(SubFlow flow) {
        return switch (flow) {
            case SetupFlow setup ->
                    new SubFlowStateDocument.Setup(
                            setup.currentPhase().name()
                    );

            case DiscardFlow discard ->
                    new SubFlowStateDocument.Discard(
                            discard.getRequiredDiscards(),
                            discard.getPendingPlayers()
                    );

            case RobberPlacementFlow ignored ->
                    new SubFlowStateDocument.RobberPlacement();

            case RobberStealFlow robberSteal ->
                    new SubFlowStateDocument.RobberSteal(
                            robberSteal.getRetrievingPlayerId(),
                            robberSteal.getCandidates()
                    );

            case RoadBuildingFlow roadBuilding ->
                    new SubFlowStateDocument.RoadBuilding(
                            roadBuilding.getRoadsPlaced(),
                            roadBuilding.getRoadsRequired()
                    );

            default -> throw new IllegalStateException(
                    "Unknown sub-flow type: " + flow.getClass()
            );
        };
    }

    private TradeOfferStateDocument toTradeOfferDocument(TradeOffer offer) {
        List<ResourceStateDocument> offeredResources =
                offer.getOfferedResources().stream()
                        .map(this::toResourceDocument)
                        .toList();

        List<String> wantedResources = offer.getWantedResources().stream()
                .map(Enum::name)
                .toList();

        Map<UUID, String> responses =
                offer.getPlayerResponses().entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().name()
                        ));

        return new TradeOfferStateDocument(
                offer.getTradeOfferId(),
                offer.getTradeOwnerId(),
                offeredResources,
                wantedResources,
                responses
        );
    }

    private Map<String, Integer> toResourceBankMap(ResourceBank bank) {
        return Arrays.stream(ResourceType.values())
                .collect(Collectors.toMap(
                        Enum::name,
                        bank::available
                ));
    }

    private GameAwardsDocument toAwardsDocument(GameAwards awards) {
        return new GameAwardsDocument(
                awards.getLongestRoadHolder().orElse(null),
                awards.getLargestArmyHolder().orElse(null)
        );
    }

    // -------------------------------------------------------------------------
    // Persistence -> Domain
    // -------------------------------------------------------------------------
    private DicePair toDicePair(DicePairStateDocument doc) {
        DiceRoll last = doc.lastRoll() != null
                ? new DiceRoll(doc.lastRoll()[0], doc.lastRoll()[1])
                : null;
        return DicePair.restore(doc.seed(), doc.rollCount(), last);
    }

    private TurnOrder toTurnOrder(TurnOrderDocument document) {
        return TurnOrder.restore(
                document.playerIds(),
                document.currentIndex(),
                document.reversed()
        );
    }

    private SubFlow toSubFlow(
            SubFlowStateDocument document,
            TurnOrder turnOrder
    ) {
        return switch (document) {
            case SubFlowStateDocument.Setup setup ->
                    SetupFlow.restore(
                            turnOrder,
                            GamePhase.valueOf(setup.phase())
                    );

            case SubFlowStateDocument.Discard discard ->
                    DiscardFlow.restore(
                            discard.requiredDiscards(),
                            discard.pendingPlayers()
                    );

            case SubFlowStateDocument.RobberPlacement ignored ->
                    new RobberPlacementFlow();

            case SubFlowStateDocument.RobberSteal robberSteal ->
                    new RobberStealFlow(
                            robberSteal.retrievingPlayerId(),
                            robberSteal.candidates()
                    );

            case SubFlowStateDocument.RoadBuilding roadBuilding ->
                    RoadBuildingFlow.restore(
                            roadBuilding.roadsPlaced(),
                            roadBuilding.roadsRequired()
                    );
        };
    }

    private Board toBoard(BoardStateDocument document) {
        Hex robberPosition = document.robberPosition() == null
                ? null
                : Hex.fromQR(
                document.robberPosition().q(),
                document.robberPosition().r()
        );

        List<Tile> tiles = document.tiles().stream()
                .map(tile -> toTile(tile, robberPosition))
                .toList();

        List<Building<?>> buildings = document.buildings().stream()
                .<Building<?>>map(this::toBuilding)
                .toList();

        return new Board(tiles, buildings);
    }

    private Building<?> toBuilding(BuildingStateDocument document) {
        List<Hex> hexes = document.locationHexes().stream()
                .map(hex -> Hex.fromQR(hex.q(), hex.r()))
                .toList();

        PieceType pieceType = PieceType.valueOf(document.pieceType());
        UUID ownerId = UUID.fromString(document.ownerId());
        UUID id = UUID.fromString(document.id());

        return switch (pieceType) {
            case SETTLEMENT ->
                    Building.settlement(
                            id,
                            ownerId,
                            toVertex(hexes)
                    );

            case CITY ->
                    Building.city(
                            id,
                            ownerId,
                            toVertex(hexes)
                    );

            case ROAD -> {
                if (hexes.size() != 2) {
                    throw new IllegalStateException(
                            "Road must have exactly 2 hexes"
                    );
                }

                yield Building.road(
                        id,
                        ownerId,
                        Edge.of(hexes.get(0), hexes.get(1))
                );
            }

            case DEVELOPMENT_CARD ->
                    throw new IllegalStateException(
                            "Development cards cannot be board buildings"
                    );
        };
    }

    private Tile toTile(TileStateDocument document, Hex robberPosition) {
        Hex hex = Hex.fromQR(document.q(), document.r());

        Tile tile = switch (TileKind.valueOf(document.kind())) {
            case DESERT -> new DesertTile(hex);
            case LAND -> new LandTile(
                    hex,
                    TileType.valueOf(document.type()),
                    document.number()
            );
            case SEA -> document.portType() != null
                    ? new PortTile(
                    hex,
                    PortType.valueOf(document.portType()),
                    document.portFacing()
            )
                    : new SeaTile(hex);
        };
        tile.removeRobber();
        if (hex.equals(robberPosition)) {
            tile.setRobbed();
        }
        return tile;
    }

    private TradeOffer toTradeOffer(TradeOfferStateDocument document) {
        List<Resource> offeredResources =
                document.offeredResources().stream()
                        .map(this::toResource)
                        .toList();

        List<ResourceType> wantedResources =
                document.wantedResources().stream()
                        .map(ResourceType::valueOf)
                        .toList();

        Map<UUID, TradeOfferResponseKind> responses =
                document.responses().entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> TradeOfferResponseKind.valueOf(
                                        entry.getValue()
                                )
                        ));

        return new TradeOffer(
                document.offerId(),
                document.initiatorId(),
                wantedResources,
                offeredResources,
                responses
        );
    }

    private Resource toResource(ResourceStateDocument document) {
        return new Resource(
                document.id(),
                ResourceType.valueOf(document.type())
        );
    }

    private DevelopmentCard toDevelopmentCard(
            DevelopmentCardStateDocument document
    ) {
        return new DevelopmentCard(
                document.id(),
                DevelopmentCardType.valueOf(document.type()),
                document.purchasedOnTurn()
        );
    }

    private Map<ResourceType, Integer> toResourceBank(
            Map<String, Integer> document
    ) {
        Map<ResourceType, Integer> resources =
                new EnumMap<>(ResourceType.class);

        document.forEach((type, amount) ->
                resources.put(ResourceType.valueOf(type), amount)
        );

        return resources;
    }

    private GameAwards toAwards(
            GameAwardsDocument document,
            GameConfiguration config
    ) {
        return GameAwards.restore(
                config,
                document.longestRoadHolder(),
                document.largestArmyHolder()
        );
    }

    private GamePlayer toPlayer(PlayerStateDocument document) {
        List<Resource> resources = document.resources().stream()
                .map(this::toResource)
                .collect(Collectors.toCollection(ArrayList::new));

        List<DevelopmentCard> developmentCards =
                document.devCards().stream()
                        .map(this::toDevelopmentCard)
                        .collect(Collectors.toCollection(ArrayList::new));

        return new GamePlayer(
                document.playerId(),
                document.username(),
                document.color(),
                resources,
                developmentCards,
                document.knightsUsed()
        );
    }

    // -------------------------------------------------------------------------
    // Shared helpers
    // -------------------------------------------------------------------------

    private Vertex toVertex(List<Hex> hexes) {
        if (hexes.size() != 3) {
            throw new IllegalStateException(
                    "Vertex must have exactly 3 hexes, got: " + hexes.size()
            );
        }

        return Vertex.of(
                hexes.get(0),
                hexes.get(1),
                hexes.get(2)
        );
    }
}
