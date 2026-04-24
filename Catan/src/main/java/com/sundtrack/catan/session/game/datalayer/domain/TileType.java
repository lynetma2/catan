package com.sundtrack.catan.session.game.datalayer.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TileType {
    FOREST("forest"),
    HILLS("hills"),
    PASTURE("pasture"),
    FIELDS("fields"),
    MOUNTAINS("mountains"),
    DESERT("desert"),
    SEA("sea");

    private final String value;

    TileType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
