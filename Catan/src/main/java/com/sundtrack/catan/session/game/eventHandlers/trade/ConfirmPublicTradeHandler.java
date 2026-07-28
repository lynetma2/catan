package com.sundtrack.catan.session.game.eventHandlers.trade;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.trade.InitiatorConfirmPublicTradeAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.trade.PublicTradeConfirmedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.TradeBook;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(InitiatorConfirmPublicTradeAction.class)
public class ConfirmPublicTradeHandler implements GameActionHandler<InitiatorConfirmPublicTradeAction> {
    private final GameStore gameStore;

    public ConfirmPublicTradeHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, InitiatorConfirmPublicTradeAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        TradeBook.TradeTerms tradeTerms = game.confirmTrade(context.playerId(), action.responderId(), action.tradeId());

        return createResults(context, action, tradeTerms);
    }

    private void doValidations(Game game, GameContext context, InitiatorConfirmPublicTradeAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, InitiatorConfirmPublicTradeAction action,
                                                   TradeBook.TradeTerms tradeTerms) {
        UUID initiatorId = context.playerId();
        UUID respondentId = action.responderId();

        List<ServerEvent> broadcast = List.of(
                new PublicTradeConfirmedEvent(initiatorId, respondentId, action.tradeId())
        );

        Map<UUID, List<ServerEvent>> directed = Map.of(
                initiatorId, List.of(
                        new ResourceGrantEvent(initiatorId, tradeTerms.wantedFromRespondent()),
                        new ResourceSpentEvent(initiatorId, tradeTerms.offeredByInitiator() /* i.e. what initiator gave */)
                ),
                respondentId, List.of(
                        new ResourceGrantEvent(respondentId, tradeTerms.offeredByInitiator()),
                        new ResourceSpentEvent(respondentId, tradeTerms.wantedFromRespondent() /* i.e. what respondent gave */)
                )
        );

        return EventResult.of(broadcast, directed);
    }
}
