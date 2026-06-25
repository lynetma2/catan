package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.OutgoingEventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.messaging.OutgoingEventEnvelopeFactory;
import com.sundtrack.catan.messaging.WebSocketMessagingService;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameMessagingService {

    private final WebSocketMessagingService messaging;
    private final OutgoingEventEnvelopeFactory outgoingEventEnvelopeFactory;

    public GameMessagingService(WebSocketMessagingService messaging, OutgoingEventEnvelopeFactory outgoingEventEnvelopeFactory) {
        this.messaging = messaging;
        this.outgoingEventEnvelopeFactory = outgoingEventEnvelopeFactory;
    }

    public void broadcast(UUID gameId, String sessionId, EventResult<? extends ServerEvent> result) {
        result.broadcast().forEach(event -> {
                    System.out.println("Broadcasting to topic: " + ApiRoutes.gameTopic(gameId) + " event: " + event);
                    OutgoingEventEnvelope envelope = outgoingEventEnvelopeFactory.create(event);
                    messaging.broadcast(ApiRoutes.gameTopic(gameId), envelope);
                }
        );
        result.directed().forEach((playerId, event) -> {
                    System.out.println("Sending directed to sessionId: " + sessionId + " destination: " + ApiRoutes.gameQueue() + " event: " + event);
                    OutgoingEventEnvelope envelope = outgoingEventEnvelopeFactory.create(event);
                    messaging.sendToUser(sessionId, ApiRoutes.gameQueue(), envelope);
                }
        );
    }

    public void sendError(String sessionId, ServerEvent error) {
        OutgoingEventEnvelope envelope = outgoingEventEnvelopeFactory.create(error);
        messaging.sendToUser(sessionId, ApiRoutes.errors(), envelope);
    }
}
