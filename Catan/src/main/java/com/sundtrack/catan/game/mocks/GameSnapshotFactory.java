package com.sundtrack.catan.game.mocks;

import com.sundtrack.catan.game.datalayer.domain.*;
import com.sundtrack.catan.game.datalayer.domain.tradeOffer.TradeOffer;
import com.sundtrack.catan.game.datalayer.domain.tradeOffer.TradeOfferKind;
import com.sundtrack.catan.game.datalayer.domain.tradeOffer.TradeOfferResponseKind;
import com.sundtrack.catan.game.datalayer.domain.tradeOffer.TradePlayerResponse;
import com.sundtrack.catan.game.datalayer.domain.world.Edge;
import com.sundtrack.catan.game.datalayer.domain.world.Hex;
import com.sundtrack.catan.game.datalayer.domain.world.Vertex;
import com.sundtrack.catan.game.datalayer.dto.placement.RoadPlacementDTO;
import com.sundtrack.catan.game.datalayer.dto.placement.SettlementPlacementDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.PlacementSnapshotDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.PlayerSnapshotDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.TileSnapshotDTO;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameSnapshotFactory {

    // --- Helper Methods for Geometry ---

    private static Vertex v(int q, int r, int dir1, int dir2) {
        Hex center = Hex.fromQR(q, r);
        Hex n1 = center.neighbor(dir1);
        Hex n2 = center.neighbor(dir2);

        List<Hex> sorted = Stream.of(center, n1, n2)
                .sorted(Comparator.comparingInt(Hex::q)
                        .thenComparingInt(Hex::r)
                        .thenComparingInt(Hex::s))
                .toList();

        return new Vertex(sorted);
    }

    private static Edge e(int q, int r, int dir) {
        Hex center = Hex.fromQR(q, r);
        Hex neighbour = center.neighbor(dir);

        List<Hex> sorted = Stream.of(center, neighbour)
                .sorted(Comparator.comparingInt(Hex::q)
                        .thenComparingInt(Hex::r)
                        .thenComparingInt(Hex::s))
                .toList();

        return new Edge(sorted);
    }

    // --- Main Factory Methods ---

    public static GameSnapshotDTO createTestGameState(int playerCount, String currentPlayerId, GamePhase phase) {
        List<PlayerSnapshotDTO> players = createPlayers(playerCount);
        return new GameSnapshotDTO(
                players,
                createTiles(),
                createPlacements(playerCount),
                phase,
                currentPlayerId,
                4,
                createActiveTradeOffers(players)
        );
    }

    private static List<PlayerSnapshotDTO> createPlayers(int count) {
        List<PlayerSnapshotDTO> allPlayers = List.of(
                new PlayerSnapshotDTO("p1", "Alice", "#e05050", List.of(
                        new Resource("r1", ResourceType.LUMBER), new Resource("r2", ResourceType.LUMBER),
                        new Resource("r3", ResourceType.BRICK), new Resource("r4", ResourceType.WOOL),
                        new Resource("r5", ResourceType.GRAIN), new Resource("r6", ResourceType.BRICK)
                ), List.of(), 2, 3, 0, true, false, 0),

                new PlayerSnapshotDTO("p2", "Bob", "#50a0e0", List.of(), List.of(), 2, 5, 1, false, true, 2),
                new PlayerSnapshotDTO("p3", "Carol", "#50c050", List.of(), List.of(), 3, 2, 0, false, false, 0),
                new PlayerSnapshotDTO("p4", "Dave", "#e0a030", List.of(), List.of(), 1, 0, 0, false, false, 0)
        );
        return allPlayers.subList(0, Math.min(count, allPlayers.size()));
    }

    private static List<TileSnapshotDTO> createTiles() {
        List<TileSnapshotDTO> tiles = new ArrayList<>();

        // Land Layout Definitions
        List<TileDef> landLayout = List.of(
                new TileDef(0, 0, TileType.DESERT, null),
                new TileDef(1, -1, TileType.FIELDS, 9), new TileDef(1, 0, TileType.FOREST, 11),
                new TileDef(0, 1, TileType.HILLS, 3), new TileDef(-1, 1, TileType.PASTURE, 6),
                new TileDef(-1, 0, TileType.MOUNTAINS, 8), new TileDef(0, -1, TileType.FOREST, 4),
                new TileDef(2, -2, TileType.PASTURE, 5), new TileDef(2, -1, TileType.HILLS, 2),
                new TileDef(2, 0, TileType.FIELDS, 6), new TileDef(1, 1, TileType.FOREST, 11),
                new TileDef(0, 2, TileType.MOUNTAINS, 3), new TileDef(-1, 2, TileType.FIELDS, 4),
                new TileDef(-2, 2, TileType.FOREST, 8), new TileDef(-2, 1, TileType.PASTURE, 10),
                new TileDef(-2, 0, TileType.HILLS, 9), new TileDef(-1, -1, TileType.FIELDS, 5),
                new TileDef(0, -2, TileType.MOUNTAINS, 10), new TileDef(1, -2, TileType.PASTURE, 12)
        );

        for (TileDef def : landLayout) {
            boolean isDesert = def.type() == TileType.DESERT;
            tiles.add(new TileSnapshotDTO(
                    Hex.fromQR(def.q(), def.r()),
                    isDesert ? TileKind.DESERT : TileKind.LAND,
                    def.type(),
                    def.number(),
                    isDesert, // Fixed: Robber on desert
                    false, null, null
            ));
        }

        // Sea Layout
        List<SeaDef> seaLayout = List.of(
                new SeaDef(0, -3, false, null, 0),                           // SEA
                new SeaDef(1, -3, true, PortType.ANY, 0),                    // ANY
                new SeaDef(2, -3, false, null, 0),                           // SEA
                new SeaDef(3, -3, true, PortType.ANY, 0),                    // ANY
                new SeaDef(3, -2, true, PortType.BRICK, 0),                  // SEA + BRICK
                new SeaDef(3, 0, false, null, 0),                            // SEA
                new SeaDef(2, 1, true, PortType.LUMBER, 0),                  // LUMBER
                new SeaDef(1, 2, false, null, 0),                            // SEA
                new SeaDef(0, 3, true, PortType.ANY, 0),                     // ANY
                new SeaDef(-1, 3, false, null, 0),                           // SEA
                new SeaDef(-2, 3, true, PortType.GRAIN, 0),                  // GRAIN
                new SeaDef(-3, 3, false, null, 0),                           // SEA
                new SeaDef(-3, 2, true, PortType.ORE, 0),                    // ORE
                new SeaDef(-3, 1, false, null, 0),                           // SEA
                new SeaDef(-3, 0, true, PortType.ANY, 0),                    // ANY
                new SeaDef(-2, -1, false, null, 0),                          // SEA
                new SeaDef(-1, -2, true, PortType.WOOL, 0),                   // WOOL
                new SeaDef(3, -1, true, null, null)                   // WOOL
        );


        // Note: You can add the remaining empty sea tiles to the list as needed

        for (SeaDef def : seaLayout) {
            tiles.add(new TileSnapshotDTO(
                    Hex.fromQR(def.q(), def.r()),
                    TileKind.SEA, TileType.SEA, null, false,
                    def.isPort(), def.portType(), def.portFacing()
            ));
        }

        return tiles;
    }

    private static PlacementSnapshotDTO createPlacements(int playerCount) {
        List<SettlementPlacementDTO> settlements = List.of(
                new SettlementPlacementDTO(v(0, 0, 1, 2), "p1"), new SettlementPlacementDTO(v(-1, 0, 0, 1), "p1"),
                new SettlementPlacementDTO(v(1, 0, 3, 4), "p2"), new SettlementPlacementDTO(v(0, 1, 1, 2), "p2"),
                new SettlementPlacementDTO(v(-1, 1, 0, 1), "p3"), new SettlementPlacementDTO(v(1, -1, 4, 5), "p3"),
                new SettlementPlacementDTO(v(-2, 1, 0, 1), "p4"), new SettlementPlacementDTO(v(0, -1, 3, 4), "p4")
        );

        List<RoadPlacementDTO> roads = List.of(
                new RoadPlacementDTO(e(0, 0, 1), "p1"), new RoadPlacementDTO(e(-1, 0, 0), "p1"),
                new RoadPlacementDTO(e(0, 0, 4), "p2"), new RoadPlacementDTO(e(0, 1, 1), "p2"),
                new RoadPlacementDTO(e(-1, 1, 0), "p3"), new RoadPlacementDTO(e(1, -1, 4), "p3"),
                new RoadPlacementDTO(e(-2, 1, 0), "p4"), new RoadPlacementDTO(e(0, -1, 4), "p4")
        );

        int limit = playerCount * 2;
        return new PlacementSnapshotDTO(
                roads.subList(0, Math.min(limit, settlements.size())),
                settlements.subList(0, Math.min(limit, roads.size())),
                List.of()
        );
    }

    private static List<TradeOffer> createActiveTradeOffers(List<PlayerSnapshotDTO> players) {
        List<Resource> offered = List.of(
                new Resource("t1", ResourceType.LUMBER),
                new Resource("t2", ResourceType.LUMBER)
        );
        List<Resource> wanted = List.of(
                new Resource("t3", ResourceType.BRICK)
        );

        List<TradePlayerResponse> responses = List.of(
                new TradePlayerResponse("p1", TradeOfferResponseKind.ACCEPT),
                new TradePlayerResponse("p3", TradeOfferResponseKind.DECLINE),
                new TradePlayerResponse("p4", TradeOfferResponseKind.NO_ANSWER)
        );

        TradeOffer offer = new TradeOffer(
                TradeOfferKind.INCOMING,
                "trade-1",
                "p2",
                offered,
                wanted,
                responses
        );

        return List.of(offer);
    }

    // --- Internal DTOs for layout building ---
    private record TileDef(int q, int r, TileType type, Integer number) {
    }

    private record SeaDef(int q, int r, boolean isPort, PortType portType, Integer portFacing) {
    }
}
