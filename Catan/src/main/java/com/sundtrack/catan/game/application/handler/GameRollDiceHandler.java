package com.sundtrack.catan.game.application.handler;

import com.sundtrack.catan.game.application.GameContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.RollDiceAction;
import com.sundtrack.catan.game.domain.event.server.RollDiceEvent;
import com.sundtrack.catan.game.domain.event.server.resource.DiscardRequiredEvent;
import com.sundtrack.catan.game.domain.event.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.game.domain.DiceRoll;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.shared.ws.HandlesEvent;
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
        DiceRoll roll = outcome.roll();
        events.add(new RollDiceEvent(new DiceRollDTO(roll.die1(), roll.die2())));

        outcome.grantedResources().forEach((playerId, resources) ->
                events.add(new ResourceGrantEvent(playerId, resources)));

        game.getPendingRequiredDiscards().forEach((playerId, amount) ->
                events.add(new DiscardRequiredEvent(playerId, amount)));

        return EventResult.of(events, Map.of());
    }

}
