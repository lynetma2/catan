package com.sundtrack.catan.game.application.handler.trade;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.trade.BankTradeAction;
import com.sundtrack.catan.game.domain.event.server.trade.BankTradeEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(BankTradeAction.class)
public class BankTradeHandler implements GameActionHandler<BankTradeAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, BankTradeAction action) {
        doValidations(game, context, action);
        List<Resource> received = game.bankTrade(context.playerId(), action.givenResources(), action.wanted());

        BankTradeEvent event = new BankTradeEvent(context.playerId(), action.givenResources(), received);

        return EventResult.of(List.of(event), Map.of());
    }

    private void doValidations(Game game, GameContext context, BankTradeAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
