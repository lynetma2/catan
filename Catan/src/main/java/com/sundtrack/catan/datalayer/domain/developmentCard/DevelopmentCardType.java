package com.sundtrack.catan.datalayer.domain.developmentCard;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DevelopmentCardType {
    KNIGHT("knight"),
    ROAD_BUILDING("roadBuilding"),
    YEAR_OF_PLENTY("yearOfPlenty"),
    MONOPOLY("monopoly"),
    VICTORY_POINT("victoryPoint");

    private final String value;

    DevelopmentCardType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static DevelopmentCardType fromValue(String value) {
        for (DevelopmentCardType type : DevelopmentCardType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown DevCardType: " + value);
    }
}