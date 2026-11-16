package com.sundtrack.catan.game.domain.board.tile;

import com.sundtrack.catan.game.domain.board.Hex;

public class LandTile extends AbstractTile {
    public LandTile(Hex hex, TileType type, Integer number) {
        super(hex, TileKind.LAND, type, number, false, false, null, null);
    }
}
