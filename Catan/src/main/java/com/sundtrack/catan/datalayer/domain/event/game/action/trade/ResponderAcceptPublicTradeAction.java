package com.sundtrack.catan.datalayer.domain.event.game.action.trade;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + TRADE + SEPARATOR + PUBLIC + SEPARATOR + "accept")
public record ResponderAcceptPublicTradeAction(
        UUID tradeId
) implements ClientAction {
}
