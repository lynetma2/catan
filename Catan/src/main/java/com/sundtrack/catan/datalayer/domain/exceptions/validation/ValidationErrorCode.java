package com.sundtrack.catan.datalayer.domain.exceptions.validation;

public enum ValidationErrorCode {
    NOT_PLAYERS_TURN,
    DISTANCE_RULE_VIOLATED,
    ILLEGAL_ACTION_IN_GAME_PHASE,
    VERTEX_IS_OCCUPIED,
    EDGE_IS_OCCUPIED,
    NO_CONNECTED_ROAD_VIOLATED,
    INSUFFICIENT_RESOURCES,
    PLAYER_NOT_FOUND
}
