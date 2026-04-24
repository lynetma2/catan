package com.sundtrack.catan.session.game.datalayer.dto.snapshot;

import com.sundtrack.catan.session.game.datalayer.domain.PortType;
import com.sundtrack.catan.session.game.datalayer.domain.TileKind;
import com.sundtrack.catan.session.game.datalayer.domain.TileType;
import com.sundtrack.catan.session.game.datalayer.domain.world.Hex;

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