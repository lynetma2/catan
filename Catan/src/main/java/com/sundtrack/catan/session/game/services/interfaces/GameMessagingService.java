package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.outbound.OutboundGameEvent;
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

    public void broadcast(UUID gameId, EventResult result) {
        result.broadcast().forEach(event ->
                messaging.broadcast(ApiRoutes.gameTopic(gameId), event)
        );
        result.directed().forEach((playerId, event) ->
                messaging.sendToUser(playerId, ApiRoutes.gameQueue(gameId), event)
        );
    }

    public void sendError(UUID playerId, OutboundGameEvent error) {
        messaging.sendToUser(playerId, ApiRoutes.errors(), error);
    }
}
