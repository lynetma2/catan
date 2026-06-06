package com.sundtrack.catan.session.lobby.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.messaging.EventPublisher;
import com.sundtrack.catan.messaging.routes.ApiRoutes;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LobbyEventPublisher {
    private final EventPublisher eventPublisher;

    public LobbyEventPublisher(EventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void publish(UUID lobbyId, String sessionId, EventResult<? extends ServerEvent> result) {
        eventPublisher.publish(
                ApiRoutes.lobbyTopic(lobbyId),   // topic
                ApiRoutes.lobbyQueue(),         // queue
                sessionId,
                result
        );
    }

    public void sendError(String sessionId, ServerEvent error) {
        eventPublisher.publishError(sessionId, error);
    }
}