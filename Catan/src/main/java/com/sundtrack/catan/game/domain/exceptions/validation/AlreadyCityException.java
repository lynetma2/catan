package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.Vertex;
import com.sundtrack.catan.game.domain.building.Building;

public class AlreadyCityException extends GameRuleException {
    public AlreadyCityException(Vertex vertex, Building<?> building) {
        super(
                ValidationErrorCode.ALREADY_CITY,
                "Vertex already has a city, vertex: " + vertex + ", building: " + building
        );
    }
}
