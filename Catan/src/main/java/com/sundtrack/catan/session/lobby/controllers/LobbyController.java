package com.sundtrack.catan.session.lobby.controllers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.LobbyCreateRequestedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.session.lobby.services.LobbyMessagingService;
import com.sundtrack.catan.session.lobby.services.interfaces.LobbyService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

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
    public void handleCreate(@Payload LobbyCreateRequestedEvent event) {
        EventResult<OutboundLobbyEvent> result = lobbyService.handle(null, event);
        lobbyMessagingService.broadcast(null, result);
    }

    // LobbyId known — all other lobby actions
    @MessageMapping("/lobby/{lobbyId}/events")
    public void handleEvent(@DestinationVariable UUID lobbyId, @Payload InboundLobbyEvent event) {
        EventResult<OutboundLobbyEvent> result = lobbyService.handle(null, event);
        lobbyMessagingService.broadcast(lobbyId, result);
    }
}