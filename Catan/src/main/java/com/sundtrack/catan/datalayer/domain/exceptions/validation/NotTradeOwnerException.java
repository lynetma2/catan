package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class NotTradeOwnerException extends GameRuleException {
    public NotTradeOwnerException(UUID tradeOfferId, UUID playerId) {
        super(
                ValidationErrorCode.NOT_TRADE_OFFER_OWNER,
                "The player does not own the trade offer. tradeOfferId: " + tradeOfferId + ", playerId: " + playerId
        );
    }
}
