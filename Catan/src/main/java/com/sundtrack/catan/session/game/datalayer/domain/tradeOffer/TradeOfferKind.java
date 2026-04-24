package com.sundtrack.catan.session.game.datalayer.domain.tradeOffer;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TradeOfferKind {
    INCOMING("incoming"),
    OUTGOING("outgoing");

    private final String value;

    TradeOfferKind(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}