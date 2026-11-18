
package com.sundtrack.catan.game.domain.testsupport;

import com.sundtrack.catan.game.domain.*;
import com.sundtrack.catan.game.domain.board.*;
import com.sundtrack.catan.game.domain.board.tile.Tile;
import com.sundtrack.catan.game.domain.board.tile.TileType;
import com.sundtrack.catan.game.domain.event.action.build.PlaceRoadAction;
import com.sundtrack.catan.game.domain.event.action.build.PlaceSettlementAction;
import com.sundtrack.catan.game.domain.exceptions.validation.GameRuleException;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Stream;

public final class GameFixture {

    public static final UUID ALICE =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    public static final UUID BOB =
            UUID.fromString("00000000-0000-0000-0000-000000000002");

    private ResourceBank resourceBank;
    private Board board;
    private long diceSeed = 1;
    private boolean setupCompleted = false;

    private final List<Consumer<Game>> setupActions = new ArrayList<>();

    private GameFixture() {
    }

    public static GameFixture aGame() {
        return new GameFixture();
    }

    // -------------------------------------------------------------------------
    // Player helpers
    // -------------------------------------------------------------------------

    public static GamePlayer player(Game game, UUID id) {
        return game.getPlayers().stream()
                .filter(player -> player.getId().equals(id))
                .findFirst()
                .orElseThrow();
    }

    /**
     * Sets an exact hand, removing all resources the player currently owns.
     */
    public static void setHand(
            GamePlayer player,
            ResourceType type,
            int count
    ) {
        for (ResourceType resourceType : ResourceType.values()) {
            player.removeAllResourcesOfType(resourceType);
        }

        player.receive(
                Stream.generate(() ->
                                new Resource(UUID.randomUUID(), type))
                        .limit(count)
                        .toList()
        );
    }

    public static Resource resource(ResourceType type) {
        return new Resource(UUID.randomUUID(), type);
    }

    // -------------------------------------------------------------------------
    // Fixture configuration
    // -------------------------------------------------------------------------

    public GameFixture withDiceSeed(long seed) {
        this.diceSeed = seed;
        return this;
    }

    public GameFixture withSetupCompleted() {
        this.setupCompleted = true;
        return this;
    }

    /**
     * Gives a player an exact number of resources of the specified type.
     * Resources are assigned after setup has completed.
     */
    public GameFixture withPlayerResources(
            UUID playerId,
            ResourceType type,
            int count
    ) {
        setupActions.add(game ->
                setHand(player(game, playerId), type, count)
        );

        return this;
    }

    // -------------------------------------------------------------------------
    // Build
    // -------------------------------------------------------------------------

    public Game build() {
        List<UUID> ids = List.of(ALICE, BOB);

        List<GamePlayer> players = ids.stream()
                .map(id -> new GamePlayer(
                        id,
                        "P-" + id,
                        "#000000",
                        new ArrayList<>(),
                        new ArrayList<>(),
                        0
                ))
                .toList();

        this.resourceBank = ResourceBank.standard();
        this.board = new BoardFactory().createStatic();

        Game game = new Game(
                UUID.randomUUID(),
                players,
                board,
                new GameFlow(TurnOrder.startingNewGame(ids), 0),
                new TradeBook(),
                new ArrayList<>(),
                new DicePair(diceSeed),
                DevelopmentCardBank.standard(),
                resourceBank,
                GameConfiguration.standard()
        );

        if (setupCompleted) {
            completeSetup(game);
        }

        setupActions.forEach(action -> action.accept(game));

        return game;
    }

    // -------------------------------------------------------------------------
    // Setup helpers
    // -------------------------------------------------------------------------

    /**
     * Drives the real public API through the setup sequence.
     */
    private static void completeSetup(Game game) {
        int maxPlacements = 4 * game.getPlayers().size();

        for (int i = 0;
             i < maxPlacements && game.getCurrentPhase().isSetupPhase();
             i++) {

            UUID playerId = game.getCurrentPlayerId();

            if (game.getCurrentPhase() == GamePhase.SETUP_PLACE_SETTLEMENT) {
                placeFirstLegalSettlement(game, playerId);
            } else {
                placeFirstLegalRoad(game, playerId);
            }
        }

        if (game.getCurrentPhase().isSetupPhase()) {
            throw new IllegalStateException(
                    "Fixture: setup did not complete"
            );
        }
    }

    private static void placeFirstLegalSettlement(
            Game game,
            UUID playerId
    ) {
        for (Tile tile : game.getTiles()) {
            if (tile.getType() == TileType.SEA) {
                continue;
            }

            for (Vertex vertex : tile.getAdjacentVertices()) {
                try {
                    game.placeSettlement(
                            new PlaceSettlementAction(vertex),
                            playerId
                    );
                    return;
                } catch (GameRuleException ignored) {
                    // Occupied or violates the distance rule; try another spot.
                }
            }
        }

        throw new IllegalStateException(
                "Fixture: no legal settlement spot for " + playerId
        );
    }

    private static void placeFirstLegalRoad(
            Game game,
            UUID playerId
    ) {
        for (Edge edge : candidateEdges(game)) {
            try {
                game.placeRoad(
                        new PlaceRoadAction(edge),
                        playerId
                );
                return;
            } catch (GameRuleException ignored) {
                // Occupied, sea, or not connected to the player's network.
            }
        }

        throw new IllegalStateException(
                "Fixture: no legal road spot for " + playerId
        );
    }

    /**
     * Every hex border on the board, in stable order.
     *
     * Mirrors Board's private allEdges(): a tile hex and an existing
     * neighbour define one edge.
     *
     * Edge.of canonicalises the hex pair, so the LinkedHashSet removes
     * duplicates encountered from the opposite side.
     */
    private static Set<Edge> candidateEdges(Game game) {
        Set<Hex> onBoard = new HashSet<>();

        for (Tile tile : game.getTiles()) {
            onBoard.add(tile.getHex());
        }

        Set<Edge> edges = new LinkedHashSet<>();

        for (Tile tile : game.getTiles()) {
            Hex hex = tile.getHex();

            for (int direction = 0; direction < 6; direction++) {
                Hex neighbour = hex.neighbor(direction);

                if (onBoard.contains(neighbour)) {
                    edges.add(Edge.of(hex, neighbour));
                }
            }
        }

        return edges;
    }

    // -------------------------------------------------------------------------
    // Access to built fixture state
    // -------------------------------------------------------------------------

    public ResourceBank resourceBank() {
        if (resourceBank == null) {
            throw new IllegalStateException(
                    "Call build() before resourceBank()"
            );
        }

        return resourceBank;
    }

    public Board board() {
        if (board == null) {
            throw new IllegalStateException(
                    "Call build() before board()"
            );
        }

        return board;
    }
}
