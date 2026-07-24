package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class CannotRespondToOwnTradeException extends GameRuleException {
    public CannotRespondToOwnTradeException(UUID tradeOfferId, UUID playerId) {
        super(
                ValidationErrorCode.RESPONDING_TO_OWN_TRADE,
                "The player cannot respond to own trade. tradeOfferId: " + tradeOfferId + ", playerId: " + playerId
        );
    }
}
