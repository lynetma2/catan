package com.sundtrack.catan.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.inbound.InboundGameEvent;
import com.sundtrack.catan.game.datalayer.domain.Game;
import com.sundtrack.catan.game.datalayer.dto.events.GameEvent;
import com.sundtrack.catan.lobby.LobbyMessages;
import com.sundtrack.catan.lobby.LobbyService;
import com.sundtrack.catan.game.services.NotificationService;
import com.sundtrack.catan.session.game.services.interfaces.GameMessagingService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@MessageMapping("/game")
public class GameController {

    GameService gameService;
    GameMessagingService gameMessagingService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/${gameId}/events")
    public void eventHandling(InboundGameEvent event, @DestinationVariable UUID gameId) {
        EventResult result = gameService.handle(gameId, event);
        gameMessagingService.broadcast(gameId, result);
    }
}