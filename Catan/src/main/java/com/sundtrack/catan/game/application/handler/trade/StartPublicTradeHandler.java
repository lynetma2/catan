package com.sundtrack.catan.game.application.handler.trade;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.trade.StartPublicTradeAction;
import com.sundtrack.catan.game.domain.event.server.trade.PublicTradeStartedEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.trade.TradeOffer;
import com.sundtrack.catan.game.dto.trade.TradeOfferDTO;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(StartPublicTradeAction.class)
public class StartPublicTradeHandler implements GameActionHandler<StartPublicTradeAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, StartPublicTradeAction action) {
        doValidations(game, context, action);
        TradeOffer tradeOffer = game.startTrade(context.playerId(), action.offered(), action.wanted());

        PublicTradeStartedEvent event = new PublicTradeStartedEvent(new TradeOfferDTO(tradeOffer));

        return EventResult.of(List.of(event), Map.of());
    }

    private void doValidations(Game game, GameContext context, StartPublicTradeAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
