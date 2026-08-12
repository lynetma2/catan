package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.TurnEndAction;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(TurnEndAction.class)
public class GameTurnEndHandler implements GameActionHandler<TurnEndAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, TurnEndAction action) {
        doValidations(game, context, action);
        game.advanceTurn();
        return EventResult.of(List.of(), Map.of());
    }

    private void doValidations(Game game, GameContext context, TurnEndAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}