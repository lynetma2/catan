package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.Vertex;

public class VertexOccupiedException extends GameRuleException {
    public VertexOccupiedException(Vertex vertex) {
        super(
                ValidationErrorCode.VERTEX_IS_OCCUPIED,
                "Vertex occupied, vertex: " + vertex
        );
    }
}
