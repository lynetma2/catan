package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class TradeOfferNotFoundException extends GameRuleException {
    public TradeOfferNotFoundException(UUID tradeOfferId) {
        super(
                ValidationErrorCode.TRADE_OFFER_NOT_FOUND,
                "The trade offer with the id is not found. tradeOfferId: " + tradeOfferId
        );
    }
}
