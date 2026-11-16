package com.sundtrack.catan.game.domain.event.server.trade;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + "bank")
public record BankTradeEvent(
        UUID playerId,
        List<Resource> given,
        List<Resource> received
) implements ServerEvent {
}
