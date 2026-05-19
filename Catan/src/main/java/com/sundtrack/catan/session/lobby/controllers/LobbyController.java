package com.sundtrack.catan.session.lobby.controllers;

import com.sundtrack.catan.common.handlers.AnonymousPrincipalHandshakeHandler;
import com.sundtrack.catan.common.handlers.WebSocketSessionKeys;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyCreateAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.GameInitializedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyStateEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.presence.PlayerContext;
import com.sundtrack.catan.session.lobby.services.LobbyMessagingService;
import com.sundtrack.catan.session.lobby.services.interfaces.LobbyService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
public class LobbyController {

    private final LobbyService lobbyService;
    private final LobbyMessagingService lobbyMessagingService;

    public LobbyController(LobbyService lobbyService, LobbyMessagingService lobbyMessagingService) {
        this.lobbyService = lobbyService;
        this.lobbyMessagingService = lobbyMessagingService;
    }

    // No lobbyId yet — create flow
    @MessageMapping("/lobby")
    public void handleCreate(@Payload LobbyCreateAction event, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleCreate called with event: " + event);

        // Upgrade the principal name now that the player has identified themselves
        if (principal instanceof AnonymousPrincipalHandshakeHandler.StompPrincipal stomp) {
            stomp.setDisplayName(event.playerName()); // was setName
        }

        EventResult<OutboundLobbyEvent> result = lobbyService.handle(principal, null, event);

        // Look for the LobbyStateEvent in the 'directed' map to find the new ID
        result.directed().values().stream()
                .filter(e -> e instanceof LobbyStateEvent)
                .map(e -> (LobbyStateEvent) e)
                .findFirst()
                .ifPresent(stateEvent -> {
                    updateSessionAttributes(headerAccessor, stateEvent.lobbyId(), PlayerContext.IN_LOBBY);
                });

        lobbyMessagingService.broadcast(null, principal.getName(), result);
    }

    // LobbyId known — all other lobby actions
    @MessageMapping("/lobby/{lobbyId}/events")
    public void handleEvent(@DestinationVariable UUID lobbyId, @Payload InboundLobbyEvent event, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleEvent called with event: " + event);
        EventResult<OutboundLobbyEvent> result = lobbyService.handle(principal, lobbyId, event);

        // Look for the LobbyStateEvent in the 'directed' map to find the new ID
        PlayerContext context = result.broadcast().stream()
                .anyMatch(e -> e instanceof GameInitializedEvent)
                ? PlayerContext.IN_GAME
                : PlayerContext.IN_LOBBY;

        updateSessionAttributes(headerAccessor, lobbyId, context);

        lobbyMessagingService.broadcast(lobbyId, principal.getName(), result);
    }

    private void updateSessionAttributes(SimpMessageHeaderAccessor headerAccessor, UUID lobbyId, PlayerContext playerContext) {
        var attrs = headerAccessor.getSessionAttributes();
        if (attrs != null) {
            attrs.put(WebSocketSessionKeys.CONTEXT_KEY, playerContext);
            attrs.put(WebSocketSessionKeys.ID_KEY, lobbyId);
        }
    }
}