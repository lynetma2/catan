package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class DevelopmentCardNotOwnedException extends GameRuleException {
    public DevelopmentCardNotOwnedException(UUID playerId, UUID developmentCardId) {
        super(
                ValidationErrorCode.DEVELOPMENT_CARD_NOT_OWNED_BY_PLAYER,
                "Player with id " + playerId + ", does not own Development Card with id " + developmentCardId
        );
    }
}
