package com.sundtrack.catan.game.domain.board.tile;

import com.sundtrack.catan.game.domain.board.Hex;

public class PortTile extends AbstractTile {
    public PortTile(Hex hex, PortType portType, Integer facing) {
        super(hex, TileKind.SEA, TileType.SEA, null, false, true, portType, facing);
    }
}
