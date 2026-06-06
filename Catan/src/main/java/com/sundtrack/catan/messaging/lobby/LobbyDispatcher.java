package com.sundtrack.catan.messaging.lobby;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.session.lobby.eventHandlers.LobbyActionHandler;
import com.sundtrack.catan.session.lobby.eventHandlers.LobbyContext;
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
