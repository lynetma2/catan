package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.UUID;

public record BuildingStateDocument(
        String id,
        String pieceType,           // SETTLEMENT, CITY, ROAD
        String ownerId,
        List<HexStateDocument> locationHexes  // 3 hexes for vertex, 2 for edge
) {}