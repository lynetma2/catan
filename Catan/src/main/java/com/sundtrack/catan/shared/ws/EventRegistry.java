package com.sundtrack.catan.shared.ws;

import com.sundtrack.catan.shared.event.EventType;
import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class EventRegistry {

    private static final Logger log = LoggerFactory.getLogger(EventRegistry.class);

    private final Map<String, Class<?>> eventTypes = new HashMap<>();

    public EventRegistry() {
        // Scan the root so future features (chat/, user/) are picked up automatically.
        Reflections reflections = new Reflections("com.sundtrack.catan");
        Set<Class<?>> events = reflections.getTypesAnnotatedWith(EventType.class);

        for (Class<?> event : events) {
            String name = event.getAnnotation(EventType.class).value();
            Class<?> previous = eventTypes.putIfAbsent(name, event);
            if (previous != null) {
                throw new IllegalStateException("Duplicate @EventType \"" + name + "\": "
                        + previous.getName() + " and " + event.getName());
            }
        }
        log.info("Registered {} event types", eventTypes.size());
    }

    public Class<?> getEventClass(String type) {
        return eventTypes.get(type);
    }
}
