package com.sundtrack.catan.session.game.eventHandlers.robber;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(RobberStealAction.class)
public class GameRobberStealHandler implements GameActionHandler<RobberStealAction> {
    private final GameStore gameStore;

    public GameRobberStealHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, RobberStealAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, RobberStealAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);

        //TODO Validate that the Target player has a building touching the robber.
        game.validateRobberStealTargetPlayer(action.targetPlayerId());
    }

    private MutationResult doMutations(Game game, RobberStealAction action) {
        //Move a random resource from the targetPlayer to the current player.

        //return new MutationResult(action.target(), newPhase);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();
//        serverEvents.add(new RobberPlaceEvent(result.robbedHex));
//        serverEvents.add(new GamePhaseChangedEvent(result.updatedPhase));

        return EventResult.of(serverEvents, Map.of());
    }

    private record MutationResult(
            Resource stolenResource
    ) {
    }
}
