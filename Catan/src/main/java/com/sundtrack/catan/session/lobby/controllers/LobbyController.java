package com.sundtrack.catan.session.lobby.controllers;

import com.sundtrack.catan.common.PrincipalUtils;
import com.sundtrack.catan.common.handlers.AnonymousPrincipalHandshakeHandler;
import com.sundtrack.catan.common.handlers.WebSocketSessionKeys;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyCreateAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.GameInitializedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyStateEvent;
import com.sundtrack.catan.datalayer.domain.presence.PlayerContext;
import com.sundtrack.catan.messaging.EventDeserializer;
import com.sundtrack.catan.messaging.lobby.LobbyDispatcher;
import com.sundtrack.catan.session.lobby.eventHandlers.LobbyContext;
import com.sundtrack.catan.session.lobby.services.LobbyEventPublisher;
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
    private final EventDeserializer eventDeserializer;
    private final LobbyDispatcher lobbyDispatcher;
    private final LobbyEventPublisher eventPublisher;

    public LobbyController(LobbyService lobbyService, LobbyMessagingService lobbyMessagingService, EventDeserializer eventDeserializer, LobbyDispatcher lobbyDispatcher, LobbyEventPublisher eventPublisher) {
        this.lobbyService = lobbyService;
        this.lobbyMessagingService = lobbyMessagingService;
        this.eventDeserializer = eventDeserializer;
        this.lobbyDispatcher = lobbyDispatcher;
        this.eventPublisher = eventPublisher;
    }

    // No lobbyId yet — create flow
    @MessageMapping("/lobby")
    public void handleCreate(@Payload EventEnvelope envelope, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleCreate called with event: " + envelope);

        ClientAction action = eventDeserializer.deserialize(envelope);
        if (!(action instanceof LobbyCreateAction)) {
            return;
        }
        LobbyCreateAction createAction = (LobbyCreateAction) action;

        // Upgrade the principal name now that the player has identified themselves
        if (principal instanceof AnonymousPrincipalHandshakeHandler.StompPrincipal stomp) {
            stomp.setDisplayName(createAction.playerName()); // was setName
        }

        UUID playerId = PrincipalUtils.extractPlayerId(principal);
        LobbyContext context = new LobbyContext(principal, playerId, null);
        EventResult<ServerEvent> result = lobbyDispatcher.dispatch(context, createAction);
        //EventResult<ServerEvent> result = lobbyService.handle(principal, null, createAction);

        // Look for the LobbyStateEvent in the 'directed' map to find the new ID
        result.directed().values().stream()
                .filter(e -> e instanceof LobbyStateEvent)
                .map(e -> (LobbyStateEvent) e)
                .findFirst()
                .ifPresent(stateEvent -> {
                    updateSessionAttributes(headerAccessor, stateEvent.lobbyId(), PlayerContext.IN_LOBBY);
                });


        eventPublisher.publish(null, principal.getName(), result);
        //lobbyMessagingService.broadcast(null, principal.getName(), result);
    }

    // LobbyId known — all other lobby actions
    @MessageMapping("/lobby/{lobbyId}/events")
    public void handleEvent(@DestinationVariable UUID lobbyId, @Payload EventEnvelope envelope, Principal principal, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("handleEvent called with event: " + envelope);
        ClientAction action = eventDeserializer.deserialize(envelope);
        UUID playerId = PrincipalUtils.extractPlayerId(principal);

        LobbyContext lobbyContext = new LobbyContext(principal, playerId, lobbyId);

        EventResult<ServerEvent> result = lobbyDispatcher.dispatch(lobbyContext, action);
        //EventResult<ServerEvent> result = lobbyService.handle(principal, lobbyId, action);

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