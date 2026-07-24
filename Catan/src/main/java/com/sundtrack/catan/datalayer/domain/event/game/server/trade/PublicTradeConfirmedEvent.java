package com.sundtrack.catan.datalayer.domain.event.game.server.trade;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

public record PublicTradeConfirmedEvent (
        UUID ownerId,
        UUID respondentId,
        UUID tradeId
) implements ServerEvent {
}
