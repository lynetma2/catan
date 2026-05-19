package com.sundtrack.catan.messaging;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

// WebSocketMessagingService — accepts OutboundEvent
@Service
public class WebSocketMessagingService {

    private final SimpMessagingTemplate messaging;

    public WebSocketMessagingService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    public void broadcast(String topic, ServerEvent event) {
        messaging.convertAndSend(topic, event);
    }
    public void sendToUser(String userName, String destination, ServerEvent event) {
        messaging.convertAndSendToUser(userName, destination, event);
    }
}