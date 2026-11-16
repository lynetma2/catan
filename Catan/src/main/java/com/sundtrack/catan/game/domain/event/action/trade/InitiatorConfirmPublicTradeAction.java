package com.sundtrack.catan.game.domain.event.action.trade;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "confirm")
public record InitiatorConfirmPublicTradeAction(
        UUID tradeId,
        UUID responderId
) implements ClientAction {
}
