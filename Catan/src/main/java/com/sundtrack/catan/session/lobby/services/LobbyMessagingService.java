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

    public void broadcast(UUID lobbyId, EventResult<? extends OutboundEvent> result) {
        result.broadcast().forEach(event ->
                messaging.broadcast(ApiRoutes.lobbyTopic(lobbyId), event)
        );
        result.directed().forEach((playerId, event) ->
                messaging.sendToUser(playerId, ApiRoutes.lobbyQueue(), event)
        );
    }

    public void sendError(UUID playerId, OutboundEvent error) {
        messaging.sendToUser(playerId, ApiRoutes.errors(), error);
    }
}
