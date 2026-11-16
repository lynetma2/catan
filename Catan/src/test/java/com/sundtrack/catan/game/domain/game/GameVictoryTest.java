package com.sundtrack.catan.game.domain.game;

import com.sundtrack.catan.game.domain.board.Board;
import com.sundtrack.catan.game.domain.board.Vertex;
import com.sundtrack.catan.game.domain.board.tile.Tile;
import com.sundtrack.catan.game.domain.board.tile.TileType;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.game.domain.exceptions.validation.GameRuleException;
import com.sundtrack.catan.game.domain.testsupport.GameFixture;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.GamePlayer;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.game.domain.testsupport.GameFixture.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameVictoryTest {

    @Test
    void settlements_and_cities_score_public_points() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        List<Vertex> placed = placeSettlements(fixture.board(), ALICE, 3);
        fixture.board().upgradeSettlement(placed.get(0), ALICE); // 2 settlements + 1 city

        assertThat(game.computePublicVictoryPoints(ALICE)).isEqualTo(4); // 2*1 + 1*2
        assertThat(game.computeTotalVictoryPoints(ALICE)).isEqualTo(4);
    }

    @Test
    void hidden_vp_cards_count_toward_total_but_not_public() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        placeSettlements(fixture.board(), ALICE, 2);
        addVpCards(player(game, ALICE), 3);

        assertThat(game.computePublicVictoryPoints(ALICE)).isEqualTo(2);
        assertThat(game.computeTotalVictoryPoints(ALICE)).isEqualTo(5);
    }

    @Test
    void reaching_ten_points_ends_the_game() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        placeSettlements(fixture.board(), ALICE, 5);
        addVpCards(player(game, ALICE), 5); // 5 + 5 = 10

        assertThat(game.evaluateEndOfAction()).isPresent();
        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.GAME_OVER);
    }

    @Test
    void nine_points_does_not_end_the_game() {
        GameFixture fixture = aGame();
        Game game = fixture.build();
        placeSettlements(fixture.board(), ALICE, 5);
        addVpCards(player(game, ALICE), 4); // 5 + 4 = 9

        assertThat(game.evaluateEndOfAction()).isEmpty();
        assertThat(game.getCurrentPhase()).isNotEqualTo(GamePhase.GAME_OVER);
    }

    // --- helpers ---

    private static List<Vertex> placeSettlements(Board board, UUID playerId, int count) {
        List<Vertex> placed = new ArrayList<>();
        for (Tile tile : board.getTiles()) {
            if (tile.getType() == TileType.SEA) continue;
            for (Vertex v : tile.getAdjacentVertices()) {
                if (placed.size() >= count) return placed;
                try {
                    board.placeSettlement(v, playerId, true);
                    placed.add(v);
                } catch (GameRuleException ignored) { /* occupied / distance rule */ }
            }
        }
        return placed;
    }

    private static void addVpCards(GamePlayer p, int n) {
        for (int i = 0; i < n; i++) {
            p.addDevelopmentCard(new DevelopmentCard(UUID.randomUUID(), DevelopmentCardType.VICTORY_POINT, 0));
        }
    }
}