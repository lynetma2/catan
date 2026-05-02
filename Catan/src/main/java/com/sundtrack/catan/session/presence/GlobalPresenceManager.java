package com.sundtrack.catan.session.presence;

import com.sundtrack.catan.common.handlers.WebSocketSessionKeys;
import com.sundtrack.catan.datalayer.domain.presence.PlayerContext;
import com.sundtrack.catan.session.lobby.services.LobbyMessagingService;
import com.sundtrack.catan.session.lobby.services.interfaces.LobbyService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.UUID;

@Component
public class GlobalPresenceManager {

    private final LobbyService lobbyService;
    private final LobbyMessagingService lobbyMessagingService;
    // private final GameService gameService; // Add when ready
    // private final GameMessagingService gameMessagingService;

    public GlobalPresenceManager(LobbyService lobbyService, LobbyMessagingService lobbyMessagingService) {
        this.lobbyService = lobbyService;
        this.lobbyMessagingService = lobbyMessagingService;
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = sha.getUser();
        var attrs = sha.getSessionAttributes();

        if (principal == null || attrs == null) return;

        String username = principal.getName();
        PlayerContext context = (PlayerContext) attrs.getOrDefault(WebSocketSessionKeys.CONTEXT_KEY, PlayerContext.NONE);
        Object rawPlayerId = attrs.get(WebSocketSessionKeys.PLAYER_ID);
        Object rawContextId = attrs.get(WebSocketSessionKeys.ID_KEY);

        UUID playerId = null;
        if (rawPlayerId instanceof String s) {
            playerId = UUID.fromString(s);
        } else if (rawPlayerId instanceof UUID u) {
            playerId = u;
        }

        UUID contextId = null;
        if (rawContextId instanceof String s) {
            contextId = UUID.fromString(s);
        } else if (rawContextId instanceof UUID u) {
            contextId = u;
        }

        // Route the event based on where the player was
        switch (context) {
            case IN_LOBBY -> {
                var result = lobbyService.handleDisconnect(principal, contextId);
                lobbyMessagingService.broadcast(contextId, username, result);
            }
            case IN_GAME -> {
                // var result = gameService.handleDisconnect(contextId, username);
                // gameMessagingService.broadcast(contextId, username, result);
            }
            case NONE -> System.out.println("User disconnected from no specific context: " + username);
        }
    }
}