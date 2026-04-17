package com.sundtrack.catan.game.model;

import com.sundtrack.catan.game.model.enums.ResourceType;

import java.util.Map;

public record GameConfig(
        Map<ResourceType, Integer> roadCost,
        Map<ResourceType, Integer> settlementCost,
        Map<ResourceType, Integer> cityCost,
        Map<ResourceType, Integer> developmentCardCost
) {
    public static GameConfig standard() {
        return new GameConfig(
                Map.of(ResourceType.BRICK, 1, ResourceType.WOOD, 1),
                Map.of(ResourceType.BRICK, 1, ResourceType.WOOD, 1, ResourceType.SHEEP, 1, ResourceType.WHEAT, 1),
                Map.of(ResourceType.ORE, 3, ResourceType.WHEAT, 2),
                Map.of(ResourceType.ORE, 1, ResourceType.SHEEP, 1, ResourceType.WHEAT, 1)
        );
    }
}