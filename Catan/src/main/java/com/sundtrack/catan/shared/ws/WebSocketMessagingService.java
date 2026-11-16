package com.sundtrack.catan.shared.ws;

import com.sundtrack.catan.shared.event.OutgoingEventEnvelope;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketMessagingService {

    private final SimpMessagingTemplate messaging;

    public WebSocketMessagingService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    public void broadcast(String topic, OutgoingEventEnvelope event) {
        messaging.convertAndSend(topic, event);
    }

    public void sendToUser(String userName, String destination, OutgoingEventEnvelope event) {
        messaging.convertAndSendToUser(userName, destination, event);
    }
}