package com.sundtrack.catan.game.datalayer.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DevCardType {
    KNIGHT("knight"),
    ROAD_BUILDING("roadBuilding"),
    YEAR_OF_PLENTY("yearOfPlenty"),
    MONOPOLY("monopoly"),
    VICTORY_POINT("victoryPoint");

    private final String value;

    DevCardType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static DevCardType fromValue(String value) {
        for (DevCardType type : DevCardType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown DevCardType: " + value);
    }
}