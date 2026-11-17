package com.sundtrack.catan.game.persistence.state;

import java.util.List;

public record BoardStateDocument(
        List<TileStateDocument> tiles,
        List<BuildingStateDocument> buildings,
        HexStateDocument robberPosition
) {}

