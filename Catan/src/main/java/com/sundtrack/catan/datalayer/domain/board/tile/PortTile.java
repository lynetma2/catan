package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;

public class PortTile extends AbstractTile {
    public PortTile(Hex hex, PortType portType, Integer facing) {
        super(hex, TileKind.SEA, TileType.SEA, null, false, true, portType, facing);
    }
}
