package com.sundtrack.catan.datalayer.domain.board.tile;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TileKind {
    LAND("land"),
    SEA("sea"),
    DESERT("desert");

    private final String value;

    TileKind(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
