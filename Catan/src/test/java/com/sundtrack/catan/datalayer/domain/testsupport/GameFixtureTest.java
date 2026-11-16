package com.sundtrack.catan.datalayer.domain.testsupport;

import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class GameFixtureTest {

    @Test
    void completed_setup_leaves_a_legal_starting_position() {
        Game game = GameFixture.aGame().withSetupCompleted().build();

        assertThat(game.getCurrentPhase()).isEqualTo(GamePhase.PRE_ROLL);
        assertThat(game.getCurrentPlayerId()).isEqualTo(GameFixture.ALICE);
        for (UUID id : List.of(GameFixture.ALICE, GameFixture.BOB)) {
            assertThat(pieceCount(game, id, PieceType.SETTLEMENT)).isEqualTo(2);
            assertThat(pieceCount(game, id, PieceType.ROAD)).isEqualTo(2);
        }
    }

    private static long pieceCount(Game game, UUID owner, PieceType kind) {
        return game.getBuildings().stream()
                .filter(b -> b.getOwnerId().equals(owner) && b.getKind() == kind)
                .count();
    }
}
