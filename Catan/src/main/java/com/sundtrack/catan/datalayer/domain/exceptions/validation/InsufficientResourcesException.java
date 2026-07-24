package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.List;
import java.util.UUID;

public class InsufficientResourcesException extends GameRuleException {
    public InsufficientResourcesException(UUID playerId, PieceType pieceType) {
        super(
                ValidationErrorCode.INSUFFICIENT_RESOURCES,
                "Player " + playerId + " has insufficient resources to build " + pieceType
        );
    }

    public InsufficientResourcesException(UUID playerId, List<Resource> givenResources) {
        super(
                ValidationErrorCode.INSUFFICIENT_RESOURCES,
                "Player " + playerId + " has insufficient resources to trade " + givenResources
        );
    }

    public InsufficientResourcesException(UUID playerId) {
        super(
                ValidationErrorCode.INSUFFICIENT_RESOURCES,
                "Player " + playerId + " has insufficient resources to trade "
        );
    }
}
