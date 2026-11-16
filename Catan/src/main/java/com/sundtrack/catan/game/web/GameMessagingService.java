package com.sundtrack.catan.game.web;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.OutgoingEventEnvelope;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.shared.ws.OutgoingEventEnvelopeFactory;
import com.sundtrack.catan.shared.ws.WebSocketMessagingService;
import com.sundtrack.catan.shared.ws.ApiRoutes;
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
        result.directed().forEach((playerId, events) ->
                events.forEach(event -> {
                    System.out.println("Sending directed to playerId: " + playerId + " destination: " + ApiRoutes.gameQueue() + " event: " + event);
                    OutgoingEventEnvelope envelope = outgoingEventEnvelopeFactory.create(event);
                    messaging.sendToUser(playerId.toString(), ApiRoutes.gameQueue(), envelope);
                })
        );
    }

    public void sendError(String sessionId, ServerEvent error) {
        OutgoingEventEnvelope envelope = outgoingEventEnvelopeFactory.create(error);
        messaging.sendToUser(sessionId, ApiRoutes.errors(), envelope);
    }
}
