package com.sundtrack.catan.game.application.handler;

import com.sundtrack.catan.game.application.GameContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.TurnEndAction;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.shared.ws.HandlesEvent;
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