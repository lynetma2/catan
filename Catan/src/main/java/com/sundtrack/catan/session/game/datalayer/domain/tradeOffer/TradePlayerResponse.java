package com.sundtrack.catan.session.game.datalayer.domain.tradeOffer;

public record TradePlayerResponse(
        String playerId,
        TradeOfferResponseKind response
) {}