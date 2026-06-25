package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

public class NotOwnerException extends GameRuleException {
    public NotOwnerException(Vertex vertex, UUID playerId) {
        super(
                ValidationErrorCode.SETTLEMENT_OWNED_BY_DIFFERENT_PLAYER,
                "Building already built and owned by different player, vertex: " + vertex + ", playerId: " + playerId
        );
    }
}
