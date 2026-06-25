package com.sundtrack.catan.messaging.game;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Service;

@Service
public class GameDispatcher {

    private final GameHandlerRegistry registry;

    public GameDispatcher(
            GameHandlerRegistry registry) {

        this.registry = registry;
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

        return handler.handle(
                context,
                action);
    }
}
