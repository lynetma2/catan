package com.sundtrack.catan.session.game.eventHandlers.robber;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(RobberStealAction.class)
public class GameRobberStealHandler implements GameActionHandler<RobberStealAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, RobberStealAction action) {
        doValidations(game, context, action);
        Resource stolen = game.stealResource(action, context.playerId());
        return createResults(context, game, action, stolen);
    }

    private void doValidations(Game game, GameContext context, RobberStealAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game, RobberStealAction action,
                                                   Resource stolen) {
        UUID targetPlayerId = action.targetPlayerId();
        UUID retrievingPlayerId = context.playerId();

        Map<UUID, List<ServerEvent>> directed = new HashMap<>();
        directed.put(targetPlayerId, List.of(new ResourceSpentEvent(targetPlayerId, List.of(stolen))));
        directed.put(retrievingPlayerId, List.of(new ResourceGrantEvent(retrievingPlayerId, List.of(stolen))));

        //TODO add global events telling people that the players has lost a card and gained a card

        return EventResult.of(List.of(), directed);
    }
}
