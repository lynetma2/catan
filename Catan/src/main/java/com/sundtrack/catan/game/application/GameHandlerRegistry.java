package com.sundtrack.catan.game.application;

import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import org.springframework.aop.support.AopUtils;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameHandlerRegistry {

    private final Map<Class<?>, GameActionHandler<?>> handlers = new HashMap<>();

    public GameHandlerRegistry(List<GameActionHandler<?>> handlers) {
        for (GameActionHandler<?> handler : handlers) {
            Class<?> targetClass = AopUtils.getTargetClass(handler);
            HandlesEvent annotation = AnnotationUtils.findAnnotation(targetClass, HandlesEvent.class);

            if (annotation == null) {
                throw new IllegalStateException(
                        targetClass.getName() + " must be annotated with @HandlesEvent");
            }

            GameActionHandler<?> previous = this.handlers.putIfAbsent(annotation.value(), handler);
            if (previous != null) {
                throw new IllegalStateException(
                        "Duplicate handler for " + annotation.value().getName() + ": "
                                + AopUtils.getTargetClass(previous).getName() + " and " + targetClass.getName());
            }
        }
    }

    public GameActionHandler<?> get(Class<?> actionType) {
        return handlers.get(actionType);
    }
}
