package com.sundtrack.catan.activeSessions;

import com.sundtrack.catan.session.game.services.RoomLifecycleService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class SessionDisconnectListener {

    private final GameSessionRegistry registry;
    private final RoomLifecycleService lifecycle;

    public SessionDisconnectListener(GameSessionRegistry registry, RoomLifecycleService lifecycle) {
        this.registry = registry;
        this.lifecycle = lifecycle;
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        registry.unbindSession(event.getSessionId())
                .forEach(lifecycle::onRoomPossiblyEmpty);
    }
}