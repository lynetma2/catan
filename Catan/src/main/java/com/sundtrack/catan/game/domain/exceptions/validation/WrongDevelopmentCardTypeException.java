package com.sundtrack.catan.game.domain.exceptions.validation;

import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;

import java.util.UUID;

public class WrongDevelopmentCardTypeException extends GameRuleException {
    public WrongDevelopmentCardTypeException(UUID developmentCardId, DevelopmentCardType expectedType, DevelopmentCardType actualType) {
        super(
                ValidationErrorCode.WRONG_DEVELOPMENT_CARD_TYPE,
                "Wrong development card type, card id: " + developmentCardId + ", expected type: " + expectedType + ", actual type: " + actualType
        );
    }
}
