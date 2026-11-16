package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "confirm")
public record PublicTradeConfirmedEvent(
        UUID ownerId,
        UUID respondentId,
        UUID tradeId
) implements ServerEvent {
}
