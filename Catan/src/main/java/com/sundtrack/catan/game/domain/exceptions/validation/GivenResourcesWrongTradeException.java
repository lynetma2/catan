package com.sundtrack.catan.game.domain.exceptions.validation;

public class GivenResourcesWrongTradeException extends GameRuleException {
    public GivenResourcesWrongTradeException() {
        super(
                ValidationErrorCode.GIVEN_RESOURCES_WRONG_IN_TRADE,
                "The given resources in the trade are wrong."
        );
    }
}
