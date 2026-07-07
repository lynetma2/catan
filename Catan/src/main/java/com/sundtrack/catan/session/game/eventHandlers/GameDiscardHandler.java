package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.resource.GameDiscardAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InvalidDiscardCountException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.PlayerNotPendingDiscardException;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(GameDiscardAction.class)
public class GameDiscardHandler implements GameActionHandler<GameDiscardAction> {
    private final GameStore gameStore;

    public GameDiscardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, GameDiscardAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);

        GamePhase phaseBefore = game.getCurrentPhase();
        List<Resource> discarded = game.discard(action, context.playerId());
        EventResult<ServerEvent> events = createResults(context, game, discarded, phaseBefore);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, GameDiscardAction action) {
        // Deliberately NOT game.validateCurrentPlayer(...) — discard can be triggered
        // by any player with excess resources, not just the current player.
        game.getCurrentPhase().validateAllowedAction(action);

        if (!game.isDiscardPending(context.playerId())) {
            throw new PlayerNotPendingDiscardException(context.playerId());
        }
        int required = game.getRequiredDiscardCount(context.playerId());
        if (action.discardedResources().size() != required) {
            throw new InvalidDiscardCountException(context.playerId(), required, action.discardedResources().size());
        }
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game game,
                                                   List<Resource> discarded, GamePhase phaseBefore) {
        List<ServerEvent> events = new ArrayList<>();

        GamePhase phaseAfter = game.getCurrentPhase();
        if (!phaseBefore.equals(phaseAfter)) {
            events.add(new GamePhaseChangedEvent(phaseAfter));
        }

        //TODO broadcast that this player discarded (without revealing which cards) to other players

        Map<UUID, ServerEvent> directed = Map.of(
                context.playerId(), new ResourceSpentEvent(context.playerId(), discarded)
        );

        return EventResult.of(events, directed);
    }
}
