package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.board.tile.PortType;
import com.sundtrack.catan.datalayer.domain.board.tile.TileKind;
import com.sundtrack.catan.datalayer.domain.board.tile.TileType;
import com.sundtrack.catan.datalayer.domain.board.Hex;

/**
 * A snapshot of a single board tile.
 * We use Integer instead of int to allow nulls for sea/desert tiles.
 */
public record TileSnapshotDTO(
        Hex hex,
        TileKind kind,
        TileType type,
        Integer number,      // null for desert/sea
        boolean hasRobber,
        boolean isPort,
        PortType portType,     // "lumber", "brick", "any", etc.
        Integer portFacing   // 0-5 index representing hex side
) {}