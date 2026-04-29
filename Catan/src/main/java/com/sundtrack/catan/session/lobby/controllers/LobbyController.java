package com.sundtrack.catan.session.lobby.controllers;

import com.sundtrack.catan.common.handlers.WebSocketSessionKeys;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.LobbyCreateRequestedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.LobbyStateEvent;
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
    public void handleCreate(@Payload LobbyCreateRequestedEvent event, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleCreate called with event: " + event);
        EventResult<OutboundLobbyEvent> result = lobbyService.handle(null, event);

        // Look for the LobbyStateEvent in the 'directed' map to find the new ID
        result.directed().values().stream()
                .filter(e -> e instanceof LobbyStateEvent)
                .map(e -> (LobbyStateEvent) e)
                .findFirst()
                .ifPresent(stateEvent -> {
                    updateSessionAttributes(headerAccessor, principal, stateEvent.lobbyId());
                });

        lobbyMessagingService.broadcast(null, principal.getName(), result);
    }

    // LobbyId known — all other lobby actions
    @MessageMapping("/lobby/{lobbyId}/events")
    public void handleEvent(@DestinationVariable UUID lobbyId, @Payload InboundLobbyEvent event, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleEvent called with event: " + event);
        EventResult<OutboundLobbyEvent> result = lobbyService.handle(lobbyId, event);
        updateSessionAttributes(headerAccessor, principal, lobbyId);
        lobbyMessagingService.broadcast(lobbyId, principal.getName(), result);
    }

    private void updateSessionAttributes(SimpMessageHeaderAccessor headerAccessor, Principal principal, UUID lobbyId) {
        var attrs = headerAccessor.getSessionAttributes();
        if (attrs != null) {
            attrs.putIfAbsent(WebSocketSessionKeys.PLAYER_ID, principal.getName());
            attrs.put(WebSocketSessionKeys.CONTEXT_KEY, PlayerContext.IN_LOBBY);
            attrs.put(WebSocketSessionKeys.ID_KEY, lobbyId);
        }
    }
}