package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Hex;

public class NoTileOnHexException extends GameRuleException {
    public NoTileOnHexException(Hex hex) {
        super(
                ValidationErrorCode.NO_TILE_ON_HEX,
                "No tile on hex: " + hex
        );
    }
}
