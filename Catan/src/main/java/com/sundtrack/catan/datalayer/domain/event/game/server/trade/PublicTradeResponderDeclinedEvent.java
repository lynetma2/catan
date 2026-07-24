package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;

import java.util.UUID;

public record PublicTradeResponderDeclinedEvent (
        UUID playerId,
        UUID tradeId,
        TradeOfferResponseKind response
) implements ServerEvent {
    public PublicTradeResponderDeclinedEvent {
        if (response != TradeOfferResponseKind.DECLINE) {
            throw new IllegalArgumentException("Response must be DECLINE.");
        }
    }

    public PublicTradeResponderDeclinedEvent(UUID playerId, UUID tradeId) {
        this(playerId, tradeId, TradeOfferResponseKind.DECLINE);
    }
}