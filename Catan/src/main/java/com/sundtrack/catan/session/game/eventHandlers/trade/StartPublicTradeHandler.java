package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.BankTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.StartPublicTradeAction;
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
@HandlesEvent(StartPublicTradeAction.class)
public class StartPublicTradeHandler implements GameActionHandler<StartPublicTradeAction> {
    private final GameStore gameStore;

    public StartPublicTradeHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, StartPublicTradeAction action) {
        Game game = gameStore.get(context.gameId());

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
