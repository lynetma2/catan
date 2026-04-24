package com.sundtrack.catan.datalayer.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PortType {
    LUMBER("lumber"),
    BRICK("brick"),
    WOOL("wool"),
    GRAIN("grain"),
    ORE("ore"),
    ANY("any");

    private final String value;

    PortType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
