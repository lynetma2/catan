package com.sundtrack.catan.lobby.application;

import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.application.handler.LobbyActionHandler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LobbyHandlerRegistry {

    private final Map<Class<?>, LobbyActionHandler<?>> handlers =
            new HashMap<>();

    public LobbyHandlerRegistry(
            List<LobbyActionHandler<?>> handlers) {

        for (LobbyActionHandler<?> handler : handlers) {

            HandlesEvent annotation =
                    handler.getClass()
                            .getAnnotation(HandlesEvent.class);

            this.handlers.put(
                    annotation.value(),
                    handler
            );
        }
    }

    public LobbyActionHandler<?> get(
            Class<?> actionType) {

        return handlers.get(actionType);
    }
}
