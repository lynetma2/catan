package com.sundtrack.catan.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.EventRegistry;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;

@Service
public class EventDeserializer {

    private final EventRegistry registry;
    private final ObjectMapper mapper;

    public EventDeserializer(
            EventRegistry registry,
            ObjectMapper mapper) {

        this.registry = registry;
        this.mapper = mapper;
    }

    public ClientAction deserialize(
            EventEnvelope envelope) {

        try {

            Class<?> clazz =
                    registry.getEventClass(
                            envelope.type());

            if (envelope.payload() == null || envelope.payload().isNull()) {
                return (ClientAction) clazz.getDeclaredConstructor().newInstance();
            }
            return (ClientAction) mapper.treeToValue(envelope.payload(), clazz);

        } catch (JsonProcessingException | NoSuchMethodException | IllegalAccessException | InstantiationException |
                 InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
