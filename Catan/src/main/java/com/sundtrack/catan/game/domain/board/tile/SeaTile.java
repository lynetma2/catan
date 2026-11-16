package com.sundtrack.catan.game.domain.board.tile;

import com.sundtrack.catan.game.domain.board.Hex;

public class SeaTile extends AbstractTile {
    public SeaTile(Hex hex) {
        super(hex, TileKind.SEA, TileType.SEA, null, false, false, null, null);
    }
}
