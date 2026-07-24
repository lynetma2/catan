package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.DrawDevelopmentCardAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.BankTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.BankTradeEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(BankTradeAction.class)
public class BankTradeHandler implements GameActionHandler<BankTradeAction> {
    private final GameStore gameStore;

    public BankTradeHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }


    @Override
    public EventResult<ServerEvent> handle(GameContext context, BankTradeAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        Resource received = game.bankTrade(context.playerId(), action.givenResources(), action.wanted());

        BankTradeEvent event = new BankTradeEvent(context.playerId(), action.givenResources(), received);

        return EventResult.of(List.of(event), Map.of());
    }

    private void doValidations(Game game, GameContext context, BankTradeAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
