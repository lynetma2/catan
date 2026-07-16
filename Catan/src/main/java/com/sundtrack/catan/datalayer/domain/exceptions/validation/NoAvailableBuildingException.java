package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.building.PieceType;

public class NoAvailableBuildingException extends GameRuleException {
    public NoAvailableBuildingException(PieceType pieceType) {
        super(
                ValidationErrorCode.NO_BUILDING_LEFT,
                "The player has already used all buildings of type, pieceType: " + pieceType
        );
    }
}
