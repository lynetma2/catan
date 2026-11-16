package com.sundtrack.catan.game.application.handler;

import com.sundtrack.catan.game.application.GameContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.resource.GameDiscardAction;
import com.sundtrack.catan.game.domain.event.server.resource.DiscardCompleteEvent;
import com.sundtrack.catan.game.domain.event.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.game.domain.exceptions.validation.InvalidDiscardCountException;
import com.sundtrack.catan.game.domain.exceptions.validation.PlayerNotPendingDiscardException;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(GameDiscardAction.class)
public class GameDiscardHandler implements GameActionHandler<GameDiscardAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, GameDiscardAction action) {
        doValidations(game, context, action);
        List<Resource> discarded = game.discard(action, context.playerId());
        return createResults(context, discarded);
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

    private EventResult<ServerEvent> createResults(GameContext context,
                                                   List<Resource> discarded) {
        List<ServerEvent> broadcastEvents = List.of(new DiscardCompleteEvent(context.playerId()));

        Map<UUID, List<ServerEvent>> directed = Map.of(
                context.playerId(), List.of(new ResourceSpentEvent(context.playerId(), discarded))
        );

        return EventResult.of(broadcastEvents, directed);
    }
}
