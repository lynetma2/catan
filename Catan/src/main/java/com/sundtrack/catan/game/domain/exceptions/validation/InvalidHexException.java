package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.Hex;

public class InvalidHexException extends GameRuleException {
    public InvalidHexException(Hex hex) {
        super(
                ValidationErrorCode.INVALID_HEX,
                "Invalid hex: " + hex
        );
    }
}
