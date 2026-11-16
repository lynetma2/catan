package com.sundtrack.catan.game.domain.event.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.trade.TradeOfferResponseKind;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "decline")
public record PublicTradeResponderDeclinedEvent(
        UUID playerId,
        UUID tradeId,
        TradeOfferResponseKind response
) implements ServerEvent {
    public PublicTradeResponderDeclinedEvent(UUID playerId, UUID tradeId) {
        this(playerId, tradeId, TradeOfferResponseKind.DECLINE);
    }

    public PublicTradeResponderDeclinedEvent {
        if (response != TradeOfferResponseKind.DECLINE) {
            throw new IllegalArgumentException("Response must be DECLINE.");
        }
    }
}