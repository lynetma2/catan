package com.sundtrack.catan.game.domain.event.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "cancel")
public record PublicTradeCancelledEvent(
        UUID tradeId
) implements ServerEvent {
}
