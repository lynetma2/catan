package com.sundtrack.catan.session.game.eventHandlers.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.build.BuildSettlementEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;

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
        MutationResult result = doMutations(game, context, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceSettlementAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
        game.validateBoardSettlement(action.target(), context.playerId());
        game.validateCanAfford(PieceType.SETTLEMENT, context.playerId());
    }

    private MutationResult doMutations(Game game, GameContext context, PlaceSettlementAction action) {
        List<Resource> deductedResources = game.deduct(PieceType.SETTLEMENT, context.playerId());
        Building<Vertex> settlement = game.addSettlement(action.target(), context.playerId());
        Optional<GamePhase> newPhase = game.advancePhaseAfterSettlement();

        return new MutationResult(settlement, deductedResources, newPhase);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> broadcastEvents = new ArrayList<>();

        broadcastEvents.add(new BuildSettlementEvent(
                result.settlement().getLocation(), context.playerId()
        ));

        result.newPhase().ifPresent(phase ->
                broadcastEvents.add(new GamePhaseChangedEvent(phase))
        );

        //TODO add events of the deducted amount of cards from the player.

        Map<UUID, ServerEvent> directed = result.deductedResources().isEmpty()
                ? Map.of()
                : Map.of(context.playerId(), new ResourceSpentEvent(context.playerId(), result.deductedResources()));

        return EventResult.of(broadcastEvents, directed);
    }

    private record MutationResult(
            Building<Vertex> settlement,
            List<Resource> deductedResources,
            Optional<GamePhase> newPhase
    ) {
    }
}