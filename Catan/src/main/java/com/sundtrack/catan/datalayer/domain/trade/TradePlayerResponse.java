package com.sundtrack.catan.datalayer.domain.trade;

public record TradePlayerResponse(
        String playerId,
        TradeOfferResponseKind response
) {}