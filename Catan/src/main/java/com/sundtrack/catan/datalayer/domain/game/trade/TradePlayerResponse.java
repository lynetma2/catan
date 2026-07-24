package com.sundtrack.catan.datalayer.domain.game.trade;

import java.util.UUID;

public record TradePlayerResponse(
        UUID playerId,
        TradeOfferResponseKind response
) {}