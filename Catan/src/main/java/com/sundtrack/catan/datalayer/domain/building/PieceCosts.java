package com.sundtrack.catan.datalayer.domain.building;

import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.Map;

public final class PieceCosts {

    private static final Map<PieceType, Map<ResourceType, Integer>> COSTS = Map.of(
            PieceType.ROAD, Map.of(
                    ResourceType.LUMBER, 1,
                    ResourceType.BRICK, 1
            ),
            PieceType.SETTLEMENT, Map.of(
                    ResourceType.LUMBER, 1,
                    ResourceType.BRICK, 1,
                    ResourceType.GRAIN, 1,
                    ResourceType.WOOL, 1
            ),
            PieceType.CITY, Map.of(
                    ResourceType.GRAIN, 2,
                    ResourceType.ORE, 3
            ),
            PieceType.DEVELOPMENT_CARD, Map.of(
                    ResourceType.GRAIN, 1,
                    ResourceType.WOOL, 1,
                    ResourceType.ORE, 1
            )
    );

    private PieceCosts() {
    }

    public static Map<ResourceType, Integer> of(PieceType pieceType) {
        return COSTS.get(pieceType);
    }
}