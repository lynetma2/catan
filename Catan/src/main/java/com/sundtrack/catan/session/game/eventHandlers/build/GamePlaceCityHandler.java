package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceCityAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildCityEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildRoadEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnEndEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnStartEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@HandlesEvent(PlaceCityAction.class)
public class GamePlaceCityHandler implements GameActionHandler<PlaceCityAction> {
    private final GameStore gameStore;

    public GamePlaceCityHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlaceCityAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, context, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceCityAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
        game.validateBoardCity(action.target(), context.playerId());
        game.validateCanAfford(PieceType.CITY, context.playerId());
    }

    private MutationResult doMutations(Game game, GameContext context, PlaceCityAction action) {
        List<Resource> deductedResources = game.deduct(PieceType.CITY, context.playerId());
        Building<Vertex> city = game.addCity(action.target(), context.playerId());
        Optional<Game.PhaseAdvanceResult> phaseAdvance = game.advancePhaseAfterRoad();

        return new MutationResult(city, deductedResources, phaseAdvance);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        serverEvents.add(new BuildCityEvent(
                result.city().getLocation(), context.playerId()
        ));
        //TODO add events of the deducted amount of cards from the player. to opponents

        Map<UUID, ServerEvent> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), new ResourceSpentEvent(context.playerId(), result.deductedResources()));

        return EventResult.of(serverEvents, directed);
    }

    private record MutationResult(
            Building<Vertex> city,
            List<Resource> deductedResources,
            Optional<Game.PhaseAdvanceResult> phaseAdvance
    ) {
    }
}