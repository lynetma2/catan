package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.CancelPublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.StartPublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeCancelledEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeStartedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.dto.trade.TradeOfferDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(CancelPublicTradeAction.class)
public class CancelPublicTradeHandler implements GameActionHandler<CancelPublicTradeAction> {
    private final GameStore gameStore;

    public CancelPublicTradeHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, CancelPublicTradeAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        game.cancelTradeOffer(context.playerId(), action.tradeId());

        PublicTradeCancelledEvent event = new PublicTradeCancelledEvent(action.tradeId());

        return EventResult.of(List.of(event), Map.of());
    }

    private void doValidations(Game game, GameContext context, CancelPublicTradeAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
