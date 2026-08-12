package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.ResponderDeclinePublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeResponderDeclinedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(ResponderDeclinePublicTradeAction.class)
public class ResponderDeclinePublicTradeHandler implements GameActionHandler<ResponderDeclinePublicTradeAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, ResponderDeclinePublicTradeAction action) {
        game.respondToTrade(context.playerId(), action.tradeId(), TradeOfferResponseKind.DECLINE);

        PublicTradeResponderDeclinedEvent event = new PublicTradeResponderDeclinedEvent(context.playerId(), action.tradeId());

        return EventResult.of(List.of(event), Map.of());
    }
}
