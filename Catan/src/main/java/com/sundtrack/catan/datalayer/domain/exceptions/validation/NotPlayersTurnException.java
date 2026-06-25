package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class NotPlayersTurnException extends GameRuleException {
    public NotPlayersTurnException(UUID current, UUID actual) {
        super(
                ValidationErrorCode.NOT_PLAYERS_TURN,
                "Not player's turn. Current: " + current + ", Actual: " + actual
        );
    }
}
