package com.sundtrack.catan.messaging;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.OutgoingEventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {

    private final WebSocketMessagingService messaging;
    private final OutgoingEventEnvelopeFactory envelopeFactory;

    public EventPublisher(
            WebSocketMessagingService messaging,
            OutgoingEventEnvelopeFactory envelopeFactory) {

        this.messaging = messaging;
        this.envelopeFactory = envelopeFactory;
    }

    public void publish(
            String topic,
            String queue,
            String sessionId,
            EventResult<? extends ServerEvent> result) {

        publishBroadcast(topic, result);
        publishDirected(queue, sessionId, result);
    }

    private void publishBroadcast(
            String topic,
            EventResult<? extends ServerEvent> result) {

        result.broadcast().forEach(event -> {

            OutgoingEventEnvelope envelope =
                    envelopeFactory.create(event);

            System.out.println(
                    "Broadcasting to topic: "
                            + topic
                            + " event: "
                            + envelope.type()
                            + " payload: "
                            + envelope.payload());

            messaging.broadcast(
                    topic,
                    envelope);
        });
    }

    private void publishDirected(
            String queue,
            String sessionId,
            EventResult<? extends ServerEvent> result) {

        result.directed().forEach((playerId, event) -> {

            OutgoingEventEnvelope envelope =
                    envelopeFactory.create(event);

            System.out.println(
                    "Sending directed to session: "
                            + sessionId
                            + " event: "
                            + envelope.type()
                            + " payload: "
                            + envelope.payload());

            messaging.sendToUser(
                    sessionId,
                    queue,
                    envelope);
        });
    }

    public void publishError(
            String sessionId,
            ServerEvent error) {

        OutgoingEventEnvelope envelope =
                envelopeFactory.create(error);

        messaging.sendToUser(
                sessionId,
                ApiRoutes.errors(),
                envelope);
    }
}
