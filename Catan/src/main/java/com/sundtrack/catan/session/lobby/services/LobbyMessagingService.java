package com.sundtrack.catan.session.lobby.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.messaging.WebSocketMessagingService;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LobbyMessagingService {

    private final WebSocketMessagingService messaging;

    public LobbyMessagingService(WebSocketMessagingService messaging) {
        this.messaging = messaging;
    }

    public void broadcast(UUID lobbyId, String sessionId, EventResult<? extends OutboundEvent> result) {
        result.broadcast().forEach(event -> {
                    System.out.println("Broadcasting to topic: " + ApiRoutes.lobbyTopic(lobbyId) + " event: " + event);
                    messaging.broadcast(ApiRoutes.lobbyTopic(lobbyId), event);
                }
        );
        result.directed().forEach((playerId, event) -> {
                    System.out.println("Sending directed to sessionId: " + sessionId + " destination: " + ApiRoutes.lobbyQueue() + " event: " + event);
                    messaging.sendToSession(sessionId, ApiRoutes.lobbyQueue(), event);
                }
        );
    }

    public void sendError(String sessionId, OutboundEvent error) {
        messaging.sendToSession(sessionId, ApiRoutes.errors(), error);
    }
}
