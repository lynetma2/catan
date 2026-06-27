package com.sundtrack.catan.session.game.eventHandlers.robber;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;

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
        MutationResult result = doMutations(game, context, action);
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

    private MutationResult doMutations(Game game, GameContext context, RobberStealAction action) {
        //Move a random resource from the targetPlayer to the current player.
        Resource resource = game.stealResource(action.targetPlayerId(), context.playerId());
        //Update the gamePhase to post roll.
        GamePhase newPhase = game.advancePhaseAfterRobberSteal();

        return new MutationResult(resource, action.targetPlayerId(), context.playerId(), newPhase);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        serverEvents.add(new GamePhaseChangedEvent(result.updatedPhase));

        Map<UUID, ServerEvent> serverEventMap = new HashMap<>();
        serverEventMap.put(result.targetPlayerId, new ResourceSpentEvent(result.targetPlayerId, List.of(result.stolenResource)));
        serverEventMap.put(result.retrievingPlayerId, new ResourceGrantEvent(result.retrievingPlayerId, List.of(result.stolenResource)));

        //TODO add global events telling people that the players has lost a card and gained a card

        return EventResult.of(serverEvents, serverEventMap);
    }

    private record MutationResult(
            Resource stolenResource,
            UUID targetPlayerId,
            UUID retrievingPlayerId,
            GamePhase updatedPhase
    ) {
    }
}
