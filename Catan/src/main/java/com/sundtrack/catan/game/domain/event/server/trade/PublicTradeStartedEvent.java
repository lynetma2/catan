package com.sundtrack.catan.game.domain.event.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.dto.trade.TradeOfferDTO;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "start")
public record PublicTradeStartedEvent(
        TradeOfferDTO tradeOfferDTO
) implements ServerEvent {
}
