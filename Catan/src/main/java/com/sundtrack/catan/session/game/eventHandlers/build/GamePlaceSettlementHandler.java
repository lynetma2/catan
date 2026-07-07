package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildSettlementEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
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
@HandlesEvent(PlaceSettlementAction.class)
public class GamePlaceSettlementHandler implements GameActionHandler<PlaceSettlementAction> {
    private final GameStore gameStore;

    public GamePlaceSettlementHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlaceSettlementAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        GamePhase phaseBefore = game.getCurrentPhase();
        Game.PlacementResult<Vertex> result = game.placeSettlement(action, context.playerId());
        EventResult<ServerEvent> events = createResults(context, game, result, phaseBefore);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceSettlementAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   Game.PlacementResult<Vertex> result, GamePhase phaseBefore) {
        List<ServerEvent> events = new ArrayList<>();

        events.add(new BuildSettlementEvent(result.building().getLocation(), context.playerId()));
        
        GamePhase phaseAfter = game.getCurrentPhase();
        if (!phaseBefore.equals(phaseAfter)) {
            events.add(new GamePhaseChangedEvent(phaseAfter));
        }
        //TODO add events of the deducted amount of cards from the player.

        Map<UUID, ServerEvent> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), new ResourceSpentEvent(context.playerId(), result.deductedResources()));

        return EventResult.of(events, directed);
    }
}