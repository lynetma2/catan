package com.sundtrack.catan.session.game.controllers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.session.game.services.GameMessagingService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@MessageMapping("/game")
public class GameController {

    GameService gameService;
    GameMessagingService gameMessagingService;

    @Autowired
    public GameController(GameService gameService, GameMessagingService gameMessagingService) {
        this.gameService = gameService;
        this.gameMessagingService = gameMessagingService;
    }

    @MessageMapping("/{gameId}/events")
    public void eventHandling(InboundGameEvent event, @DestinationVariable UUID gameId, Principal principal) {
        System.out.println("handleEvent called with event: " + event);

        EventResult<OutboundGameEvent> result = gameService.handle(principal, gameId, event);
        gameMessagingService.broadcast(gameId, principal.getName(), result);
    }
}