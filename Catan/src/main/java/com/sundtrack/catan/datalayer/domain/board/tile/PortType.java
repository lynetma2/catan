package com.sundtrack.catan.datalayer.domain.board.tile;

import com.fasterxml.jackson.annotation.JsonValue;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

public enum PortType {
    LUMBER(ResourceType.LUMBER),
    BRICK(ResourceType.BRICK),
    WOOL(ResourceType.WOOL),
    GRAIN(ResourceType.GRAIN),
    ORE(ResourceType.ORE),
    ANY(null);

    private final ResourceType resourceType;

    PortType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    @JsonValue
    public String getValue() {
        return resourceType != null ? resourceType.getValue() : "any";
    }
}
