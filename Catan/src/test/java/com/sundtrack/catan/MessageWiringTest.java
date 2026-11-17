package com.sundtrack.catan;

import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.domain.event.action.EndSummaryAction;
import com.sundtrack.catan.lobby.application.handler.LobbyActionHandler;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.ws.EventRegistry;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import org.junit.jupiter.api.Test;
import org.reflections.Reflections;
import org.springframework.stereotype.Component;

import java.lang.reflect.Modifier;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

class MessageWiringTest {

    private static final Reflections SCAN = new Reflections("com.sundtrack.catan");

    /** Actions the dispatcher handles inline rather than via a registered handler. */
    private static final Set<Class<?>> DISPATCHED_DIRECTLY = Set.of(
            EndSummaryAction.class // GameDispatcher.dispatchFinished reads the archive
    );

    @Test
    void event_registry_resolves_every_annotated_event() {
        Set<Class<?>> annotated = SCAN.getTypesAnnotatedWith(EventType.class);
        assertThat(annotated).isNotEmpty(); // a scan that finds nothing is itself a bug

        EventRegistry registry = new EventRegistry();
        for (Class<?> type : annotated) {
            String wireName = type.getAnnotation(EventType.class).value();
            assertThat(registry.getEventClass(wireName))
                    .as("wire name '%s' (%s)", wireName, type.getSimpleName())
                    .isEqualTo(type);
        }
    }

    @Test
    void every_client_action_has_a_spring_bean_handler() {
        Set<Class<?>> covered = new HashSet<>();
        for (Class<?> handler : concreteHandlers()) {
            HandlesEvent annotation = handler.getAnnotation(HandlesEvent.class);
            assertThat(annotation)
                    .as("%s must be annotated @HandlesEvent", handler.getSimpleName()).isNotNull();
            assertThat(handler.getAnnotation(Component.class))
                    .as("%s must be a Spring bean or it will never be collected", handler.getSimpleName())
                    .isNotNull();
            covered.add(annotation.value());
        }

        Set<Class<? extends ClientAction>> actions = SCAN.getSubTypesOf(ClientAction.class);
        assertThat(actions).isNotEmpty();

        for (Class<? extends ClientAction> action : actions) {
            if (DISPATCHED_DIRECTLY.contains(action)) continue;
            assertThat(covered)
                    .as("no handler registered for %s", action.getSimpleName())
                    .contains(action);
        }
    }

    private static List<Class<?>> concreteHandlers() {
        List<Class<?>> all = new ArrayList<>();
        all.addAll(SCAN.getSubTypesOf(GameActionHandler.class));
        all.addAll(SCAN.getSubTypesOf(LobbyActionHandler.class));
        return all.stream()
                .filter(c -> !c.isInterface() && !Modifier.isAbstract(c.getModifiers()))
                .toList();
    }
}