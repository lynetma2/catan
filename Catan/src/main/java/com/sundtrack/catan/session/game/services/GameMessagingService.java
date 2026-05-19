package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.ServerGameEvent;
import com.sundtrack.catan.messaging.WebSocketMessagingService;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameMessagingService {

    private final WebSocketMessagingService messaging;

    public GameMessagingService(WebSocketMessagingService messaging) {
        this.messaging = messaging;
    }

    public void broadcast(UUID gameId, String sessionId, EventResult<? extends ServerEvent> result) {
        result.broadcast().forEach(event -> {
                    System.out.println("Broadcasting to topic: " + ApiRoutes.gameTopic(gameId) + " event: " + event);
                    messaging.broadcast(ApiRoutes.gameTopic(gameId), event);
                }
        );
        result.directed().forEach((playerId, event) -> {
                    System.out.println("Sending directed to sessionId: " + sessionId + " destination: " + ApiRoutes.lobbyQueue() + " event: " + event);
                    messaging.sendToUser(sessionId, ApiRoutes.gameQueue(), event);
                }
        );
    }

    public void sendError(String sessionId, ServerGameEvent error) {
        messaging.sendToUser(sessionId, ApiRoutes.errors(), error);
    }
}
