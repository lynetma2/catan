package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
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

    public void broadcast(UUID gameId, String sessionId, EventResult<? extends OutboundEvent> result) {
        result.broadcast().forEach(event ->
                messaging.broadcast(ApiRoutes.gameTopic(gameId), event)
        );
        result.directed().forEach((playerId, event) ->
                messaging.sendToUser(sessionId, ApiRoutes.gameQueue(gameId), event)
        );
    }

    public void sendError(String sessionId, OutboundGameEvent error) {
        messaging.sendToUser(sessionId, ApiRoutes.errors(), error);
    }
}
