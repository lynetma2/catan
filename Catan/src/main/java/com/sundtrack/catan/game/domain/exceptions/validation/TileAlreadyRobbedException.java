package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.board.tile.Tile;

public class TileAlreadyRobbedException extends GameRuleException {
    public TileAlreadyRobbedException(Tile tile) {
        super(
                ValidationErrorCode.TILE_ALREADY_ROBBED,
                "Tile already has the robber: " + tile
        );
    }
}
