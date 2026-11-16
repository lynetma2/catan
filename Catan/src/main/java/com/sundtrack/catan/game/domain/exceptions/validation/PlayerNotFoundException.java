package com.sundtrack.catan.game.domain.exceptions.validation;

import java.util.UUID;

public class PlayerNotFoundException extends GameRuleException {
    public PlayerNotFoundException(UUID playerId) {
        super(
                ValidationErrorCode.PLAYER_NOT_FOUND,
                "Player with id " + playerId + " not found"
        );
    }
}
