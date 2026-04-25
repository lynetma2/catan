package com.sundtrack.catan.messaging;

import com.sundtrack.catan.datalayer.domain.event.outbound.OutboundGameEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WebSocketMessagingService {

    private final SimpMessagingTemplate messaging;

    public WebSocketMessagingService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    // Broadcast to all subscribers of a topic
    public void broadcast(String topic, OutboundGameEvent event) {
        messaging.convertAndSend(topic, event);
    }

    // Send to a specific user on a specific destination
    public void sendToUser(UUID userId, String destination, OutboundGameEvent event) {
        messaging.convertAndSendToUser(
                userId.toString(),
                destination,
                event
        );
    }
}