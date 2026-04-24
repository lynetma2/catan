package com.sundtrack.catan.datalayer.domain.game;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GamePhase {
    SETUP_PLACE_SETTLEMENT("setup_place_settlement"),
    SETUP_PLACE_ROAD("setup_place_road"),
    PRE_ROLL("pre_roll"),
    POST_ROLL("post_roll"),
    ROBBER_PLACEMENT("robber_placement"),
    ROBBER_STEAL("robber_steal"),
    TRADING("trading"),
    END("end");

    private final String value;

    GamePhase(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static GamePhase fromValue(String value) {
        for (GamePhase phase : GamePhase.values()) {
            if (phase.value.equalsIgnoreCase(value)) {
                return phase;
            }
        }
        throw new IllegalArgumentException("Unknown GamePhase: " + value);
    }
}