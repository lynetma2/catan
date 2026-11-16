package com.sundtrack.catan.game.domain.board;

import com.sundtrack.catan.game.domain.board.Hex;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

class HexTest {

    @Test
    void fromQR_completes_the_cube_coordinate() {
        Hex h = Hex.fromQR(2, -3);
        assertThat(h.s()).isEqualTo(1);
        assertThat(h.q() + h.r() + h.s()).isZero();
    }

    @Test
    void rejects_coordinates_that_dont_sum_to_zero() {
        assertThatThrownBy(() -> new Hex(1, 1, 1)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void every_neighbor_is_exactly_one_step_away() {
        Hex center = Hex.fromQR(0, 0);
        for (int dir = 0; dir < 6; dir++) {
            assertThat(distance(center, center.neighbor(dir))).isEqualTo(1);
        }
    }

    @Test
    void stepping_out_and_back_returns_to_the_start() {
        Hex center = Hex.fromQR(1, -2);
        for (int dir = 0; dir < 6; dir++) {
            assertThat(center.neighbor(dir).neighbor((dir + 3) % 6)).isEqualTo(center);
        }
    }

    @Test
    void a_hex_has_six_distinct_neighbors() {
        Hex center = Hex.fromQR(0, 0);
        Set<Hex> neighbors = new HashSet<>();
        for (int dir = 0; dir < 6; dir++) neighbors.add(center.neighbor(dir));
        assertThat(neighbors).hasSize(6);
    }

    private static int distance(Hex a, Hex b) {
        return (Math.abs(a.q() - b.q()) + Math.abs(a.r() - b.r()) + Math.abs(a.s() - b.s())) / 2;
    }
}