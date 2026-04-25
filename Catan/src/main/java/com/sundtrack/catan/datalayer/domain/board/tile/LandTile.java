package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;

public class LandTile extends AbstractTile {
    public LandTile(Hex hex, TileType type, Integer number) {
        super(hex, TileKind.LAND, type, number, false, false, null, null);
    }
}
