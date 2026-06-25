package com.sundtrack.catan.datalayer.domain.board.tile;

import com.fasterxml.jackson.annotation.JsonValue;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

public enum TileType {
    FOREST("forest", ResourceType.LUMBER),
    HILLS("hills", ResourceType.BRICK),
    PASTURE("pasture", ResourceType.WOOL),
    FIELDS("fields", ResourceType.GRAIN),
    MOUNTAINS("mountains", ResourceType.ORE),
    DESERT("desert", null),
    SEA("sea", null);

    private final String value;
    private final ResourceType resourceType;

    TileType(String value, ResourceType resourceType) {
        this.value = value;
        this.resourceType = resourceType;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public boolean producesResource() {
        return resourceType != null;
    }
}
