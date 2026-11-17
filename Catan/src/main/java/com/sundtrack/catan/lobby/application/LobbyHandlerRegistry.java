package com.sundtrack.catan.lobby.application;

import com.sundtrack.catan.lobby.application.handler.LobbyActionHandler;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import org.springframework.aop.support.AopUtils;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LobbyHandlerRegistry {

    private final Map<Class<?>, LobbyActionHandler<?>> handlers = new HashMap<>();

    public LobbyHandlerRegistry(List<LobbyActionHandler<?>> handlers) {
        for (LobbyActionHandler<?> handler : handlers) {
            Class<?> targetClass = AopUtils.getTargetClass(handler);
            HandlesEvent annotation = AnnotationUtils.findAnnotation(targetClass, HandlesEvent.class);

            if (annotation == null) {
                throw new IllegalStateException(
                        targetClass.getName() + " must be annotated with @HandlesEvent");
            }

            LobbyActionHandler<?> previous = this.handlers.putIfAbsent(annotation.value(), handler);
            if (previous != null) {
                throw new IllegalStateException(
                        "Duplicate handler for " + annotation.value().getName() + ": "
                                + AopUtils.getTargetClass(previous).getName() + " and " + targetClass.getName());
            }
        }
    }

    public LobbyActionHandler<?> get(Class<?> actionType) {
        return handlers.get(actionType);
    }
}
