package com.sundtrack.catan.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.game.model.Game;
import com.sundtrack.catan.game.dto.events.GameEvent;
import com.sundtrack.catan.lobby.LobbyMessages;
import com.sundtrack.catan.lobby.LobbyService;
import com.sundtrack.catan.game.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Controller
@MessageMapping("/game")
public class GameController {

    private GameService gameService;
    private LobbyService lobbyService;
    private SimpMessagingTemplate template;
    private NotificationService notificationService;

    @Autowired
    public GameController(SimpMessagingTemplate template, GameService gameService,  LobbyService lobbyService, NotificationService notificationService) {
        this.template = template;
        this.gameService = gameService;
        this.lobbyService = lobbyService;
        this.notificationService = notificationService;
    }

    // For full state sync: /game/fullStatus/{lobbyId}
    // For event state: /game/status/{lobbyId}

    @MessageMapping("/event/{lobbyId}")
    public void eventHandling(GameEvent event, @DestinationVariable int lobbyId) {
        List<GameEvent> consequences = gameService.handleGameEvent(lobbyId, event);
        notificationService.broadcastEvents(lobbyId, consequences);
    }

    //TODO handle the generation of games not as websocket communication
    //TODO create something to handle lobbies.
    @MessageMapping("/new")
    public void newGame(LobbyMessages.LobbyIdMessage message) {
        int lobbyId = message.lobbyId();
        Game game = gameService.newGame(lobbyId, lobbyService.getLobby(lobbyId));

        String text = null;
        try {
            text = new ObjectMapper().writeValueAsString(game);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        //Sending full state on both connections.
        this.template.convertAndSend("/game/status/" + lobbyId, text);
        this.template.convertAndSend("/game/fullStatus/" + lobbyId, text);
    }

    @MessageMapping("/get/{lobbyId}")
    @SendTo("/game/fullStatus/{lobbyId}")
    public Game getGame(@DestinationVariable Integer lobbyId) {
        return gameService.getGame(lobbyId);
    }
}