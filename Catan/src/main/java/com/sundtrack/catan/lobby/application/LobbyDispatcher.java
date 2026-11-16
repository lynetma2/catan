package com.sundtrack.catan.lobby.application;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.application.handler.LobbyActionHandler;
import org.springframework.stereotype.Service;

@Service
public class LobbyDispatcher {

    private final LobbyHandlerRegistry registry;

    public LobbyDispatcher(
            LobbyHandlerRegistry registry) {

        this.registry = registry;
    }

    @SuppressWarnings("unchecked")
    public EventResult<ServerEvent> dispatch(
            LobbyContext context,
            ClientAction action) {

        LobbyActionHandler<ClientAction> handler =
                (LobbyActionHandler<ClientAction>)
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
