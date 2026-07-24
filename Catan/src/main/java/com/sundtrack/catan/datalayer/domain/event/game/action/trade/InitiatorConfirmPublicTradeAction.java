package com.sundtrack.catan.datalayer.domain.event.game.action.trade;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;

import java.util.UUID;

public record InitiatorConfirmPublicTradeAction(
        UUID tradeId,
        UUID responderId
) implements ClientAction {
}
