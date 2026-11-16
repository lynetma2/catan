package com.sundtrack.catan.game.domain.trade;

import java.util.UUID;

public record TradePlayerResponse(
        UUID playerId,
        TradeOfferResponseKind response
) {}