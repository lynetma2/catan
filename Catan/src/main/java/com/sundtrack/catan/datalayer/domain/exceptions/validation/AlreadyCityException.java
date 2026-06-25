package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.Building;

public class AlreadyCityException extends GameRuleException {
    public AlreadyCityException(Vertex vertex, Building<?> building) {
        super(
                ValidationErrorCode.ALREADY_CITY,
                "Vertex already has a city, vertex: " + vertex + ", building: " + building
        );
    }
}
