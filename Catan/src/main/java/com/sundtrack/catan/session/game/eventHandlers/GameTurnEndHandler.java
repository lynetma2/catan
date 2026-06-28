package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.TurnEndAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnEndEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnStartEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(TurnEndAction.class)
public class GameTurnEndHandler implements GameActionHandler<TurnEndAction> {
    private final GameStore gameStore;

    public GameTurnEndHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, TurnEndAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, context, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, TurnEndAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private MutationResult doMutations(Game game, GameContext context, TurnEndAction action) {
        UUID endingPlayerId = context.playerId();
        Game.TurnAdvanceResult turnAdvance = game.advanceTurn();

        return new MutationResult(endingPlayerId, turnAdvance.newCurrentPlayerId(), turnAdvance.initialPhase());
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();
        serverEvents.add(new TurnEndEvent(result.endingPlayerId()));
        serverEvents.add(new GamePhaseChangedEvent(result.newPhase));
        serverEvents.add(new TurnStartEvent(result.newCurrentPlayerId()));

        return EventResult.of(serverEvents, Map.of());
    }

    private record MutationResult(
            UUID endingPlayerId,
            UUID newCurrentPlayerId,
            GamePhase newPhase
    ) {
    }
}