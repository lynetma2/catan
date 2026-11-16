package com.sundtrack.catan.game.domain.board;

import com.sundtrack.catan.game.domain.board.Board;
import com.sundtrack.catan.game.domain.board.BoardFactory;
import com.sundtrack.catan.game.domain.board.Hex;
import com.sundtrack.catan.game.domain.board.tile.Tile;
import com.sundtrack.catan.game.domain.board.tile.TileKind;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BoardFactoryTest {

    private final BoardFactory factory = new BoardFactory();

    @Test
    void same_seed_produces_the_same_board() {
        Board a = factory.createSeeded(42);
        Board b = factory.createSeeded(42);
        for (Tile t : a.getTiles()) {
            Tile other = b.getTileAt(t.getHex());
            assertThat(other.getType()).isEqualTo(t.getType());
            assertThat(other.getNumber()).isEqualTo(t.getNumber());
        }
    }

    @Test
    void red_tokens_are_never_adjacent() {
        for (long seed = 0; seed < 200; seed++) {
            Board board = factory.createSeeded(seed);
            for (Tile tile : board.getTiles()) {
                if (tile.getNumber() == null || !isRed(tile.getNumber())) continue;
                for (int dir = 0; dir < 6; dir++) {
                    Tile neighbor = findTile(board, tile.getHex().neighbor(dir));
                    if (neighbor == null || neighbor.getNumber() == null) continue;
                    assertThat(isRed(neighbor.getNumber()))
                            .as("seed %d: red token at %s touches red at %s", seed, tile.getHex(), neighbor.getHex())
                            .isFalse();
                }
            }
        }
    }

    @Test
    void standard_board_has_the_expected_tile_mix() {
        Board board = factory.createStatic();
        assertThat(board.getTiles()).hasSize(37);
        assertThat(count(board, TileKind.LAND)).isEqualTo(18);
        assertThat(count(board, TileKind.DESERT)).isEqualTo(1);
        assertThat(board.getTiles().stream().filter(Tile::isPort).count()).isEqualTo(9);
        assertThat(board.getTiles().stream().filter(t -> t.getNumber() != null).count()).isEqualTo(18);
    }

    private static boolean isRed(int n) { return n == 6 || n == 8; }

    private static Tile findTile(Board b, Hex h) {
        return b.getTiles().stream().filter(t -> t.getHex().equals(h)).findFirst().orElse(null);
    }

    private static long count(Board b, TileKind kind) {
        return b.getTiles().stream().filter(t -> t.getKind() == kind).count();
    }
}