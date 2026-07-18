package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class DevelopmentCardNotPlayableException extends GameRuleException {
    public DevelopmentCardNotPlayableException(UUID developmentCardId) {
        super(
                ValidationErrorCode.DEVELOPMENT_CARD_NOT_PLAYABLE,
                "DevelopmentCard with id " + developmentCardId + ", is not playable."
        );
    }
}
