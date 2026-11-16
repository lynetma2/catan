package com.sundtrack.catan.game.application.handler.trade;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.trade.CancelPublicTradeAction;
import com.sundtrack.catan.game.domain.event.server.trade.PublicTradeCancelledEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(CancelPublicTradeAction.class)
public class CancelPublicTradeHandler implements GameActionHandler<CancelPublicTradeAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, CancelPublicTradeAction action) {
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
