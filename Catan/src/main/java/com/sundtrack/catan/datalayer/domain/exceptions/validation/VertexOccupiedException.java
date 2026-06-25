package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

public class VertexOccupiedException extends GameRuleException {
    public VertexOccupiedException(Vertex vertex) {
        super(
                ValidationErrorCode.VERTEX_IS_OCCUPIED,
                "Vertex occupied, vertex: " + vertex
        );
    }
}
