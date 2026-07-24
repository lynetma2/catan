package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.ResponderAcceptPublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.StartPublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeResponderAcceptedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeStartedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;
import com.sundtrack.catan.datalayer.dto.trade.TradeOfferDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(ResponderAcceptPublicTradeAction.class)
public class ResponderAcceptPublicTradeHandler implements GameActionHandler<ResponderAcceptPublicTradeAction> {
    private final GameStore gameStore;

    public ResponderAcceptPublicTradeHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, ResponderAcceptPublicTradeAction action) {
        Game game = gameStore.get(context.gameId());

        game.respondToTrade(context.playerId(), action.tradeId(), TradeOfferResponseKind.ACCEPT);

        PublicTradeResponderAcceptedEvent event = new PublicTradeResponderAcceptedEvent(context.playerId(), action.tradeId());

        return EventResult.of(List.of(event), Map.of());
    }
}
