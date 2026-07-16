package com.sundtrack.catan.session.lobby.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.OutgoingEventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.messaging.OutgoingEventEnvelopeFactory;
import com.sundtrack.catan.messaging.WebSocketMessagingService;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LobbyMessagingService {

    private final WebSocketMessagingService messaging;
    private final OutgoingEventEnvelopeFactory envelopeFactory;

    public LobbyMessagingService(WebSocketMessagingService messaging, OutgoingEventEnvelopeFactory envelopeFactory) {
        this.messaging = messaging;
        this.envelopeFactory = envelopeFactory;
    }

    public void broadcast(UUID lobbyId, String sessionId, EventResult<? extends ServerEvent> result) {
        result.broadcast().forEach(event -> {
                    System.out.println("Broadcasting to topic: " + ApiRoutes.lobbyTopic(lobbyId) + " event: " + event);
                    OutgoingEventEnvelope envelope = envelopeFactory.create(event);
                    messaging.broadcast(ApiRoutes.lobbyTopic(lobbyId), envelope);
                }
        );
        result.directed().forEach((playerId, events) ->
                events.forEach(event -> {
                    System.out.println("Sending directed to sessionId: " + sessionId + " destination: " + ApiRoutes.lobbyQueue() + " event: " + event);
                    OutgoingEventEnvelope envelope = envelopeFactory.create(event);
                    messaging.sendToUser(sessionId, ApiRoutes.lobbyQueue(), envelope);
                })
        );
    }

    public void sendError(String sessionId, ServerEvent error) {
        OutgoingEventEnvelope envelope = envelopeFactory.create(error);
        messaging.sendToUser(sessionId, ApiRoutes.errors(), envelope);
    }
}
