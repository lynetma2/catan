package com.sundtrack.catan.game.application.handler.trade;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.trade.ResponderDeclinePublicTradeAction;
import com.sundtrack.catan.game.domain.event.server.trade.PublicTradeResponderDeclinedEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.trade.TradeOfferResponseKind;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
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
