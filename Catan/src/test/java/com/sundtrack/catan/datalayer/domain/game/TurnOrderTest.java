package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.game.TurnOrder.SetupAdvanceResult;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class TurnOrderTest {

    private static final UUID A = UUID.randomUUID();
    private static final UUID B = UUID.randomUUID();
    private static final UUID C = UUID.randomUUID();

    @Test
    void two_player_setup_snakes_a_b_b_a() {
        assertThat(setupPlacers(List.of(A, B))).containsExactly(A, B, B, A);
    }

    @Test
    void three_player_setup_snakes_a_b_c_c_b_a() {
        assertThat(setupPlacers(List.of(A, B, C))).containsExactly(A, B, C, C, B, A);
    }

    @Test
    void normal_advance_wraps_around() {
        TurnOrder order = TurnOrder.startingNewGame(List.of(A, B, C));
        assertThat(order.currentPlayerId()).isEqualTo(A);
        order.advance();
        assertThat(order.currentPlayerId()).isEqualTo(B);
        order.advance();
        assertThat(order.currentPlayerId()).isEqualTo(C);
        order.advance();
        assertThat(order.currentPlayerId()).isEqualTo(A);
    }

    @Test
    void setup_requires_at_least_two_players() {
        assertThatThrownBy(() -> TurnOrder.startingNewGame(List.of(A)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void final_setup_round_begins_at_the_turnaround() {
        TurnOrder order = TurnOrder.startingNewGame(List.of(A, B));
        assertThat(order.isFinalSetupRound()).isFalse();
        order.advanceSetup(); // A -> B
        assertThat(order.isFinalSetupRound()).isFalse();
        order.advanceSetup(); // B turns around
        assertThat(order.isFinalSetupRound()).isTrue();
    }

    @Test
    void restore_recreates_a_saved_position() {
        TurnOrder order = TurnOrder.restore(List.of(A, B, C), 1, true);
        assertThat(order.currentPlayerId()).isEqualTo(B);
        assertThat(order.isFinalSetupRound()).isTrue();
    }

    /** Records who places at each setup step, driving the real advanceSetup() loop. */
    private static List<UUID> setupPlacers(List<UUID> players) {
        TurnOrder order = TurnOrder.startingNewGame(players);
        List<UUID> placers = new ArrayList<>();
        placers.add(order.currentPlayerId());
        while (order.advanceSetup() != SetupAdvanceResult.SETUP_COMPLETE) {
            placers.add(order.currentPlayerId());
        }
        return placers;
    }
}