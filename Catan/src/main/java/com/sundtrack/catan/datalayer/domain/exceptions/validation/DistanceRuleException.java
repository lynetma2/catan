package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

public class DistanceRuleException extends GameRuleException {
    public DistanceRuleException(Vertex vertex) {
        super(
                ValidationErrorCode.DISTANCE_RULE_VIOLATED,
                "The distance rule is violated with this vertex: " + vertex
        );
    }
}
