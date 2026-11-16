package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.trade.TradeOfferDTO;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "start")
public record PublicTradeStartedEvent(
        TradeOfferDTO tradeOfferDTO
) implements ServerEvent {
}
