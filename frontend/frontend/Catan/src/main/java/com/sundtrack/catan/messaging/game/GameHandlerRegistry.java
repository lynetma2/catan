package com.sundtrack.catan.messaging.game;

import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameHandlerRegistry {

    private final Map<Class<?>, GameActionHandler<?>> handlers =
            new HashMap<>();

    public GameHandlerRegistry(
            List<GameActionHandler<?>> handlers) {

        for (GameActionHandler<?> handler : handlers) {

            HandlesEvent annotation =
                    handler.getClass()
                            .getAnnotation(HandlesEvent.class);

            this.handlers.put(
                    annotation.value(),
                    handler
            );
        }
    }

    public GameActionHandler<?> get(
            Class<?> actionType) {

        return handlers.get(actionType);
    }
}
