package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;

class DesertTile extends AbstractTile {
    public DesertTile(Hex hex) {
        super(hex, TileKind.DESERT, TileType.DESERT, null, true, false, null, null);
    }
}
