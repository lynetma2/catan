package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildRoadEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnEndEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnStartEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GameFlow;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@HandlesEvent(PlaceRoadAction.class)
public class GamePlaceRoadHandler implements GameActionHandler<PlaceRoadAction> {
    private final GameStore gameStore;

    public GamePlaceRoadHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlaceRoadAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, context, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceRoadAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private MutationResult doMutations(Game game, GameContext context, PlaceRoadAction action) {
        Game.PlacementResult<Edge> placementResult = game.placeRoad(action.target(), context.playerId());
        Optional<GameFlow.PhaseAdvanceResult> phaseAdvance = game.advancePhaseAfterRoad();

        return new MutationResult(placementResult.building(), placementResult.deductedResources(), phaseAdvance);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        serverEvents.add(new BuildRoadEvent(
                result.road().getLocation(), context.playerId()
        ));

        result.phaseAdvance().ifPresent(advance -> {
            serverEvents.add(new GamePhaseChangedEvent(advance.newPhase()));

            if (advance.turnPassed()) {
                serverEvents.add(new TurnEndEvent(context.playerId()));
                serverEvents.add(new TurnStartEvent(advance.newCurrentPlayerId()));
            }
        });

        //TODO add events of the deducted amount of cards from the player.

        Map<UUID, ServerEvent> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), new ResourceSpentEvent(context.playerId(), result.deductedResources()));

        return EventResult.of(serverEvents, directed);
    }

    private record MutationResult(
            Building<Edge> road,
            List<Resource> deductedResources,
            Optional<GameFlow.PhaseAdvanceResult> phaseAdvance
    ) {
    }
}