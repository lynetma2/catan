package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildSettlementEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
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
        Game.PlacementResult<Vertex> result = game.placeSettlement(action, context.playerId());
        return createResults(context, game, result);
    }

    private void doValidations(Game game, GameContext context, PlaceSettlementAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   Game.PlacementResult<Vertex> result) {
        List<ServerEvent> events = new ArrayList<>();
        events.add(new BuildSettlementEvent(result.building().getLocation(), context.playerId()));

        List<ServerEvent> directedToPlayer = new ArrayList<>();
        if (!result.deductedResources().isEmpty()) {
            directedToPlayer.add(new ResourceSpentEvent(context.playerId(), result.deductedResources()));
        }
        if (!result.grantedResources().isEmpty()) {
            directedToPlayer.add(new ResourceGrantEvent(context.playerId(), result.grantedResources()));
        }

        Map<UUID, List<ServerEvent>> directed = directedToPlayer.isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), directedToPlayer);

        return EventResult.of(events, directed);
    }
}