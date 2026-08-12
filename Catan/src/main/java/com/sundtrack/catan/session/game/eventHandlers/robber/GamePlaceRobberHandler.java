package com.sundtrack.catan.session.game.eventHandlers.robber;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.PlaceRobberAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.robber.RobberPlaceEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.robber.StealTargetRequiredEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@HandlesEvent(PlaceRobberAction.class)
public class GamePlaceRobberHandler implements GameActionHandler<PlaceRobberAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlaceRobberAction action) {
        doValidations(game, context, action);
        game.placeRobber(action, context.playerId());
        return createResults(context, game, action);
    }

    private void doValidations(Game game, GameContext context, PlaceRobberAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   PlaceRobberAction action) {
        List<ServerEvent> events = new ArrayList<>();
        events.add(new RobberPlaceEvent(action.target()));

        Map<UUID, List<ServerEvent>> directed = new HashMap<>();
        List<UUID> candidates = game.getStealCandidates();
        if (!candidates.isEmpty()) {
            directed.put(context.playerId(), List.of(new StealTargetRequiredEvent(context.playerId(), candidates)));
        }
        return EventResult.of(events, directed);
    }
}