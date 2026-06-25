package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.building.PieceType;

import java.util.UUID;

public class InsufficientResourcesException extends GameRuleException {
    public InsufficientResourcesException(UUID playerId, PieceType pieceType) {
        super(
                ValidationErrorCode.INSUFFICIENT_RESOURCES,
                "Player " + playerId + " has insufficient resources to build " + pieceType
        );
    }
}
