package com.sundtrack.catan.game.datalayer.domain.tradeOffer;

public record TradePlayerResponse(
        String playerId,
        TradeOfferResponseKind response
) {}