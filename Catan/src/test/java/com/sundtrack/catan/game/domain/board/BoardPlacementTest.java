package com.sundtrack.catan.game.domain.board;

import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.game.domain.exceptions.validation.*;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.ALICE;
import static com.sundtrack.catan.game.domain.testsupport.GameFixture.BOB;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BoardPlacementTest {

    // JUnit creates a fresh test instance per method → fresh board, no shared state.
    private final Board board = new BoardFactory().createStatic();

    // Border between the desert centre (0,0) and its dir-0 neighbour (1,0).
    private final Edge edge = Edge.of(0, 0, 0);
    private final Vertex v1 = edge.getVertices().get(0);
    private final Vertex v2 = edge.getVertices().get(1); // adjacent to v1 → distance rule pair

    @Nested
    class Settlements {

        @Test
        void cannot_place_on_an_occupied_vertex() {
            board.placeSettlement(v1, ALICE, true);
            assertThatThrownBy(() -> board.placeSettlement(v1, BOB, true))
                    .isInstanceOf(VertexOccupiedException.class);
        }

        @Test
        void distance_rule_forbids_adjacent_vertices() {
            board.placeSettlement(v1, ALICE, true);
            assertThatThrownBy(() -> board.placeSettlement(v2, BOB, true))
                    .isInstanceOf(DistanceRuleException.class);
        }

        @Test
        void needs_a_connected_road_unless_rule_is_skipped() {
            assertThatThrownBy(() -> board.placeSettlement(v1, ALICE, false))
                    .isInstanceOf(NoConnectedRoadException.class);

            board.placeRoad(edge, ALICE, true);
            board.placeSettlement(v1, ALICE, false); // connected now → accepted

            assertThat(board.countSettlements(ALICE)).isEqualTo(1);
        }
    }

    @Nested
    class Roads {

        @Test
        void road_without_any_network_is_rejected() {
            assertThatThrownBy(() -> board.placeRoad(edge, ALICE, false))
                    .isInstanceOf(NoConnectedRoadException.class);
        }

        @Test
        void cannot_build_on_an_occupied_edge() {
            board.placeRoad(edge, ALICE, true);
            assertThatThrownBy(() -> board.placeRoad(edge, BOB, true))
                    .isInstanceOf(EdgeOccupiedException.class);
        }

        @Test
        void cannot_build_between_two_sea_tiles() {
            Edge openWater = Edge.of(2, -3, 0); // sea (2,-3) ↔ port (3,-3), both TileKind.SEA
            assertThatThrownBy(() -> board.placeRoad(openWater, ALICE, true))
                    .isInstanceOf(InvalidEdgeException.class);
        }

        @Test
        void road_may_extend_from_an_existing_road() {
            board.placeRoad(edge, ALICE, true);   // (0,0)↔(1,0)
            Edge next = Edge.of(0, 0, 1);         // (0,0)↔(1,-1), shares an endpoint vertex

            board.placeRoad(next, ALICE, false);  // network rule enforced, still legal

            assertThat(board.countRoads(ALICE)).isEqualTo(2);
        }
    }

    @Nested
    class Cities {

        @Test
        void upgrade_requires_an_existing_settlement() {
            assertThatThrownBy(() -> board.upgradeSettlement(v1, ALICE))
                    .isInstanceOf(NoSettlementToUpgradeException.class);
        }

        @Test
        void cannot_upgrade_another_players_settlement() {
            board.placeSettlement(v1, ALICE, true);
            assertThatThrownBy(() -> board.upgradeSettlement(v1, BOB))
                    .isInstanceOf(NotOwnerException.class);
        }

        @Test
        void upgrade_replaces_the_settlement() {
            board.placeSettlement(v1, ALICE, true);

            board.upgradeSettlement(v1, ALICE);

            assertThat(board.countSettlements(ALICE)).isZero();
            assertThat(board.countCities(ALICE)).isEqualTo(1);
            assertThat(board.getBuildingAt(v1).orElseThrow().getKind()).isEqualTo(PieceType.CITY);
        }

        @Test
        void cannot_upgrade_a_city_twice() {
            board.placeSettlement(v1, ALICE, true);
            board.upgradeSettlement(v1, ALICE);
            assertThatThrownBy(() -> board.upgradeSettlement(v1, ALICE))
                    .isInstanceOf(AlreadyCityException.class);
        }
    }
}