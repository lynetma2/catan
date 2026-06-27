package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class InvalidStealTargetException extends GameRuleException {
    public InvalidStealTargetException(UUID playerId) {
        super(
                ValidationErrorCode.INVALID_STEAL_PLAYER,
                "The player does not own a building connected to the robber, playerId: " + playerId
        );
    }
}
