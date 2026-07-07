package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class InvalidDiscardCountException extends GameRuleException {
    public InvalidDiscardCountException(UUID playerId, int requiredDiscardCount, int discardCount) {
        super(
                ValidationErrorCode.INVALID_DISCARD_COUNT,
                "Invalid amount of discard cards. playerId: " + playerId + " required amount: " + requiredDiscardCount + " discardCount: " + discardCount
        );
    }
}
