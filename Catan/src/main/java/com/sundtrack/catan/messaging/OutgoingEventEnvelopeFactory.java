package com.sundtrack.catan.messaging;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.OutgoingEventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import org.springframework.stereotype.Component;

@Component
public class OutgoingEventEnvelopeFactory {

    public OutgoingEventEnvelope create(
            ServerEvent event) {

        EventType annotation =
                event.getClass()
                        .getAnnotation(EventType.class);

        if (annotation == null) {
            throw new IllegalStateException(
                    event.getClass().getSimpleName()
                            + " is missing @EventType");
        }

        return new OutgoingEventEnvelope(
                annotation.value(),
                event
        );
    }
}
