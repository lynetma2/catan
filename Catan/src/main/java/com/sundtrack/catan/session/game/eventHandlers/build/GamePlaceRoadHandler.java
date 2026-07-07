package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildRoadEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnEndEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnStartEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

        GamePhase phaseBefore = game.getCurrentPhase();
        UUID playerBefore = game.getCurrentPlayerId();
        Game.PlacementResult<Edge> result = game.placeRoad(action, context.playerId());
        EventResult<ServerEvent> events = createResults(context, game, result, playerBefore, phaseBefore);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceRoadAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   Game.PlacementResult<Edge> result, UUID playerBefore, GamePhase phaseBefore) {
        List<ServerEvent> events = new ArrayList<>();

        events.add(new BuildRoadEvent(result.building().getLocation(), context.playerId()));

        GamePhase phaseAfter = game.getCurrentPhase();
        if (!phaseBefore.equals(phaseAfter)) {
            events.add(new GamePhaseChangedEvent(phaseAfter));
        }

        UUID playerAfter = game.getCurrentPlayerId();
        if (!playerBefore.equals(playerAfter)) {
            events.add(new TurnEndEvent(context.playerId()));
            events.add(new TurnStartEvent(playerAfter));
        }

        //TODO add events of the deducted amount of cards from the player.

        Map<UUID, ServerEvent> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), new ResourceSpentEvent(context.playerId(), result.deductedResources()));

        return EventResult.of(events, directed);
    }
}