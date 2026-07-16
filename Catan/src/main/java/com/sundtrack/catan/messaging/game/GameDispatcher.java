package com.sundtrack.catan.messaging.game;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Service;

@Service
public class GameDispatcher {

    private final GameHandlerRegistry registry;
    private final GameStore gameStore;

    public GameDispatcher(
            GameHandlerRegistry registry, GameStore gameStore) {

        this.registry = registry;
        this.gameStore = gameStore;
    }

    @SuppressWarnings("unchecked")
    public EventResult<ServerEvent> dispatch(
            GameContext context,
            ClientAction action) {

        GameActionHandler<ClientAction> handler =
                (GameActionHandler<ClientAction>)
                        registry.get(action.getClass());

        if (handler == null) {
            throw new IllegalArgumentException(
                    "No handler registered for "
                            + action.getClass().getSimpleName());
        }

        EventResult<ServerEvent> result = handler.handle(
                context,
                action);

        Game game = gameStore.get(context.gameId());
        EventResult<ServerEvent> finalResult = game.evaluateEndOfAction()
                .map(EventResult::broadcast)
                .map(result::merge)
                .orElse(result);

        game.recordEvent(action, finalResult, context);

        return result;
    }
}
