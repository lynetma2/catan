package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.RollDiceAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.RollDiceEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.DiscardRequiredEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(RollDiceAction.class)
public class GameRollDiceHandler implements GameActionHandler<RollDiceAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, RollDiceAction action) {
        doValidations(game, context, action);
        Game.RollOutcome result = doMutations(game);

        return createResults(game, result);
    }

    private void doValidations(Game game, GameContext context, RollDiceAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private Game.RollOutcome doMutations(Game game) {
        return game.rollDice();
    }

    private EventResult<ServerEvent> createResults(Game game, Game.RollOutcome outcome) {
        List<ServerEvent> events = new ArrayList<>();
        events.add(new RollDiceEvent(outcome.roll()));

        outcome.grantedResources().forEach((playerId, resources) ->
                events.add(new ResourceGrantEvent(playerId, resources)));

        game.getPendingRequiredDiscards().forEach((playerId, amount) ->
                events.add(new DiscardRequiredEvent(playerId, amount)));

        return EventResult.of(events, Map.of());
    }

}
