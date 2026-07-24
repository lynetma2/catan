package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

public record BankTradeEvent (
        UUID playerId,
        List<Resource> given,
        Resource received
) implements ServerEvent {
}
