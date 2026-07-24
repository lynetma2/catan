package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.trade.TradeOfferDTO;

public record PublicTradeStartedEvent(
        TradeOfferDTO tradeOfferDTO
) implements ServerEvent {
}
