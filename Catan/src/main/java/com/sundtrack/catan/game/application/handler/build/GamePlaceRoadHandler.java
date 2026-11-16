package com.sundtrack.catan.game.application.handler.build;

import com.sundtrack.catan.game.domain.board.Edge;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.build.PlaceRoadAction;
import com.sundtrack.catan.game.domain.event.server.build.BuildRoadEvent;
import com.sundtrack.catan.game.domain.event.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlaceRoadAction.class)
public class GamePlaceRoadHandler implements GameActionHandler<PlaceRoadAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlaceRoadAction action) {
        doValidations(game, context, action);
        Game.PlacementResult<Edge> result = game.placeRoad(action, context.playerId());
        return createResults(context, game, result);
    }

    private void doValidations(Game game, GameContext context, PlaceRoadAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   Game.PlacementResult<Edge> result) {
        List<ServerEvent> events = new ArrayList<>();

        events.add(new BuildRoadEvent(result.building().getLocation(), context.playerId()));
        
        Map<UUID, List<ServerEvent>> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), List.of(new ResourceSpentEvent(context.playerId(), result.deductedResources())));

        return EventResult.of(events, directed);
    }
}