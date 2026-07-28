package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "accept")
public record PublicTradeResponderAcceptedEvent(
        UUID playerId,
        UUID tradeId,
        TradeOfferResponseKind response
) implements ServerEvent {
    public PublicTradeResponderAcceptedEvent(UUID playerId, UUID tradeId) {
        this(playerId, tradeId, TradeOfferResponseKind.ACCEPT);
    }

    public PublicTradeResponderAcceptedEvent {
        if (response != TradeOfferResponseKind.ACCEPT) {
            throw new IllegalArgumentException("Response must be ACCEPT.");
        }
    }
}
