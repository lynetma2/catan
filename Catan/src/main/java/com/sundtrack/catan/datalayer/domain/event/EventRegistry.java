package com.sundtrack.catan.datalayer.domain.event;

import org.reflections.Reflections;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class EventRegistry {

    private final Map<String, Class<?>> eventTypes =
            new HashMap<>();

    public EventRegistry() {

        Reflections reflections =
                new Reflections(
                        "com.sundtrack.catan.datalayer.domain.event"
                );

        Set<Class<?>> events =
                reflections.getTypesAnnotatedWith(
                        EventType.class
                );

        for (Class<?> event : events) {

            EventType annotation =
                    event.getAnnotation(EventType.class);

            eventTypes.put(
                    annotation.value(),
                    event
            );
        }
    }

    public Class<?> getEventClass(String type) {
        return eventTypes.get(type);
    }
}
