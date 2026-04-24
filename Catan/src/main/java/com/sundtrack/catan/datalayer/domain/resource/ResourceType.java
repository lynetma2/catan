package com.sundtrack.catan.datalayer.domain.resource;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ResourceType {
    LUMBER("lumber"),
    BRICK("brick"),
    WOOL("wool"),
    GRAIN("grain"),
    ORE("ore");

    private final String value;

    ResourceType(String value) {
        this.value = value;
    }

    @JsonValue // Ensures Jackson serializes this as "lumber" instead of "LUMBER"
    public String getValue() {
        return value;
    }
}
