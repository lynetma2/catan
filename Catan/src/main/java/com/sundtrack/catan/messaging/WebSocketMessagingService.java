package com.sundtrack.catan.messaging;

import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

// WebSocketMessagingService — accepts OutboundEvent
@Service
public class WebSocketMessagingService {

    private final SimpMessagingTemplate messaging;

    public WebSocketMessagingService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    public void broadcast(String topic, OutboundEvent event) {
        messaging.convertAndSend(topic, event);
    }

    public void sendToUser(UUID userId, String destination, OutboundEvent event) {
        messaging.convertAndSendToUser(userId.toString(), destination, event);
    }
}