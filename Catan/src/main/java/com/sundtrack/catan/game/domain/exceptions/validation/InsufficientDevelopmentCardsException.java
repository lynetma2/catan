package com.sundtrack.catan.game.domain.exceptions.validation;

public class InsufficientDevelopmentCardsException extends GameRuleException {
    public InsufficientDevelopmentCardsException() {
        super(
                ValidationErrorCode.INSUFFICIENT_DEVELOPMENT_CARDS,
                "The bank has insufficient development cards"
        );
    }
}
