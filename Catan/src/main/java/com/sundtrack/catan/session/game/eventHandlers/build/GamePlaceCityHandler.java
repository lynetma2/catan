package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceCityAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildCityEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlaceCityAction.class)
public class GamePlaceCityHandler implements GameActionHandler<PlaceCityAction> {
    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlaceCityAction action) {
        doValidations(game, context, action);
        Game.PlacementResult<Vertex> result = doMutations(game, context, action);
        return createResults(context, result);
    }

    private void doValidations(Game game, GameContext context, PlaceCityAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private Game.PlacementResult<Vertex> doMutations(Game game, GameContext context, PlaceCityAction action) {
        return game.placeCity(action.target(), context.playerId());
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game.PlacementResult<Vertex> result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        serverEvents.add(new BuildCityEvent(
                result.building().getLocation(), context.playerId()
        ));
        //TODO add events of the deducted amount of cards from the player. to opponents

        Map<UUID, List<ServerEvent>> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), List.of(new ResourceSpentEvent(context.playerId(), result.deductedResources())));

        return EventResult.of(serverEvents, directed);
    }
}