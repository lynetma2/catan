package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Hex;

public class InvalidHexException extends GameRuleException {
    public InvalidHexException(Hex hex) {
        super(
                ValidationErrorCode.INVALID_HEX,
                "Invalid hex: " + hex
        );
    }
}
