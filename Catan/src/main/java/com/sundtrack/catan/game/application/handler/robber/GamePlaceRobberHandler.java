package com.sundtrack.catan.game.application.handler.robber;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.robber.PlaceRobberAction;
import com.sundtrack.catan.game.domain.event.server.robber.RobberPlaceEvent;
import com.sundtrack.catan.game.domain.event.server.robber.StealTargetRequiredEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
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