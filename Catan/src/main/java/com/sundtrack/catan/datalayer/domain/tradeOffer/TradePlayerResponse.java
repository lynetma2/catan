package com.sundtrack.catan.datalayer.domain.tradeOffer;

public record TradePlayerResponse(
        String playerId,
        TradeOfferResponseKind response
) {}