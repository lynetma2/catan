package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.Hex;

public class NoTileOnHexException extends GameRuleException {
    public NoTileOnHexException(Hex hex) {
        super(
                ValidationErrorCode.NO_TILE_ON_HEX,
                "No tile on hex: " + hex
        );
    }
}
