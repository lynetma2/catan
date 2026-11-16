package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.Edge;

public class InvalidEdgeException extends GameRuleException {
    public InvalidEdgeException(Edge edge) {
        super(
                ValidationErrorCode.INVALID_EDGE,
                "Invalid edge: " + edge
        );
    }
}
