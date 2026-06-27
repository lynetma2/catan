package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Edge;

public class EdgeOccupiedException extends GameRuleException {
    public EdgeOccupiedException(Edge edge) {
        super(
                ValidationErrorCode.EDGE_IS_OCCUPIED,
                "Edge occupied, edge: " + edge
        );
    }
}
