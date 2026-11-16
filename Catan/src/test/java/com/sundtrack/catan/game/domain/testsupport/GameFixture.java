package com.sundtrack.catan.game.domain.testsupport;

import com.sundtrack.catan.game.domain.board.*;
import com.sundtrack.catan.game.domain.board.tile.Tile;
import com.sundtrack.catan.game.domain.board.tile.TileType;
import com.sundtrack.catan.game.domain.event.action.build.PlaceRoadAction;
import com.sundtrack.catan.game.domain.event.action.build.PlaceSettlementAction;
import com.sundtrack.catan.game.domain.exceptions.validation.GameRuleException;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;
import com.sundtrack.catan.game.domain.*;

import java.util.*;
import java.util.stream.Stream;

public final class GameFixture {

    public static final UUID ALICE = UUID.fromString("00000000-0000-0000-0000-000000000001");
    public static final UUID BOB = UUID.fromString("00000000-0000-0000-0000-000000000002");

    private ResourceBank resourceBank;
    private Board board;
    private long diceSeed = 1;
    private boolean setupCompleted = false;

    private GameFixture() {
    }

    public static GameFixture aGame() {
        return new GameFixture();
    }

    public static GamePlayer player(Game game, UUID id) {
        return game.getPlayers().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst().orElseThrow();
    }

    /**
     * Exact hand, wiping starter resources gained during setup.
     */
    public static void setHand(GamePlayer p, ResourceType type, int count) {
        for (ResourceType t : ResourceType.values()) {
            p.removeAllResourcesOfType(t);
        }
        p.receive(Stream.generate(() -> new Resource(UUID.randomUUID(), type))
                .limit(count).toList());
    }

    public static Resource resource(ResourceType type) {
        return new Resource(UUID.randomUUID(), type);
    }

    public GameFixture withDiceSeed(long seed) {
        this.diceSeed = seed;
        return this;
    }

    // ---------- setup: drive the real public API, A,B,B,A ----------

    public GameFixture withSetupCompleted() {
        this.setupCompleted = true;
        return this;
    }

    public Game build() {
        List<UUID> ids = List.of(ALICE, BOB);
        List<GamePlayer> players = ids.stream()
                .map(id -> new GamePlayer(id, "P-" + id, "#000000",
                        new ArrayList<>(), new ArrayList<>(), 0))
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
                GameConfiguration.standard());

        if (setupCompleted) completeSetup(game);
        return game;
    }

    private static void completeSetup(Game game) {
        int maxPlacements = 4 * game.getPlayers().size(); // 2 settlements + 2 roads each
        for (int i = 0; i < maxPlacements && game.getCurrentPhase().isSetupPhase(); i++) {
            UUID who = game.getCurrentPlayerId();
            if (game.getCurrentPhase() == GamePhase.SETUP_PLACE_SETTLEMENT) {
                placeFirstLegalSettlement(game, who);
            } else {
                placeFirstLegalRoad(game, who);
            }
        }
        if (game.getCurrentPhase().isSetupPhase()) {
            throw new IllegalStateException("Fixture: setup did not complete");
        }
    }

    private static void placeFirstLegalSettlement(Game game, UUID who) {
        for (Tile tile : game.getTiles()) {              // land tiles come first in getTiles()
            if (tile.getType() == TileType.SEA) continue;
            for (Vertex vertex : tile.getAdjacentVertices()) {
                try {
                    game.placeSettlement(new PlaceSettlementAction(vertex), who);
                    return;                              // placed AND setup flow advanced
                } catch (GameRuleException ignored) {    // occupied / distance rule → next spot
                }
            }
        }
        throw new IllegalStateException("Fixture: no legal settlement spot for " + who);
    }

    // ---------- small helpers used by the tests ----------

    private static void placeFirstLegalRoad(Game game, UUID who) {
        for (Edge edge : candidateEdges(game)) {
            try {
                game.placeRoad(new PlaceRoadAction(edge), who);
                return;
            } catch (GameRuleException ignored) {        // occupied / sea / not my network → next
            }
        }
        throw new IllegalStateException("Fixture: no legal road spot for " + who);
    }

    /**
     * Every hex border on the board, in stable order.
     * Mirrors Board's private allEdges(): a tile hex + an existing neighbour = one edge.
     * Edge.of canonicalises the hex pair, so the LinkedHashSet removes the
     * "seen from the other side" duplicates.
     */
    private static Set<Edge> candidateEdges(Game game) {
        Set<Hex> onBoard = new HashSet<>();
        for (Tile tile : game.getTiles()) {
            onBoard.add(tile.getHex());
        }

        Set<Edge> edges = new LinkedHashSet<>();
        for (Tile tile : game.getTiles()) {
            Hex hex = tile.getHex();
            for (int dir = 0; dir < 6; dir++) {
                Hex neighbour = hex.neighbor(dir);
                if (onBoard.contains(neighbour)) {
                    edges.add(Edge.of(hex, neighbour));
                }
            }
        }
        return edges;
    }

    public ResourceBank resourceBank() {
        if (resourceBank == null) throw new IllegalStateException("call build() before resourceBank()");
        return resourceBank;
    }

    public Board board() {
        if (board == null) throw new IllegalStateException("call build() before board()");
        return board;
    }
}