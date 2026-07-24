package com.sundtrack.catan.datalayer.domain.event.game.action.trade;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;

import java.util.UUID;

public record ResponderAcceptPublicTradeAction(
        UUID tradeId
) implements ClientAction {
}
