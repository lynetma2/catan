package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;

import java.util.UUID;

public record PublicTradeResponderAcceptedEvent (
        UUID playerId,
        UUID tradeId,
        TradeOfferResponseKind response
) implements ServerEvent {
    public PublicTradeResponderAcceptedEvent {
        if (response != TradeOfferResponseKind.ACCEPT) {
            throw new IllegalArgumentException("Response must be ACCEPT.");
        }
    }

    public PublicTradeResponderAcceptedEvent(UUID playerId, UUID tradeId) {
        this(playerId, tradeId, TradeOfferResponseKind.ACCEPT);
    }
}
