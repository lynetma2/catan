package com.sundtrack.catan.datalayer.domain.tradeOffer;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TradeOfferResponseKind {
    ACCEPT("accept"),
    DECLINE("decline"),
    NO_ANSWER("noAnswer");

    private final String value;

    TradeOfferResponseKind(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
