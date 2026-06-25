package com.sundtrack.catan.session.game.controllers;

import com.sundtrack.catan.common.PrincipalUtils;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventEnvelope;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.messaging.EventDeserializer;
import com.sundtrack.catan.messaging.game.GameDispatcher;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameMessagingService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@MessageMapping("/game")
public class GameController {

    private final GameService gameService;
    private final GameMessagingService gameMessagingService;
    private final EventDeserializer eventDeserializer;
    private final GameDispatcher gameDispatcher;

    @Autowired
    public GameController(GameService gameService, GameMessagingService gameMessagingService, EventDeserializer eventDeserializer, GameDispatcher gameDispatcher) {
        this.gameService = gameService;
        this.gameMessagingService = gameMessagingService;
        this.eventDeserializer = eventDeserializer;
        this.gameDispatcher = gameDispatcher;
    }

    @MessageMapping("/{gameId}/events")
    public void eventHandling(EventEnvelope envelope, @DestinationVariable UUID gameId, Principal principal) {
        System.out.println("handleEvent called with event: " + envelope);
        ClientAction event = eventDeserializer.deserialize(envelope);
        UUID playerId = PrincipalUtils.extractPlayerId(principal);

        GameContext context = new GameContext(principal, playerId, gameId);

        EventResult<ServerEvent> result = gameDispatcher.dispatch(context, event);

        //EventResult<ServerEvent> result = gameService.handle(principal, gameId, event);
        gameMessagingService.broadcast(gameId, principal.getName(), result);
    }
}