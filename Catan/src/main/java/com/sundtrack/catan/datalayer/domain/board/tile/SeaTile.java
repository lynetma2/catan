package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;

public class SeaTile extends AbstractTile {
    public SeaTile(Hex hex) {
        super(hex, TileKind.SEA, TileType.SEA, null, false, false, null, null);
    }
}
