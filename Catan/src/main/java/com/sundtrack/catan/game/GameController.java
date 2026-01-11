package com.sundtrack.catan.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.game.model.Game;
import com.sundtrack.catan.game.dto.events.GameEvent;
import com.sundtrack.catan.lobby.LobbyMessages;
import com.sundtrack.catan.lobby.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*")
@MessageMapping("/game")
public class GameController {

    private GameService gameService;
    private LobbyService lobbyService;
    private SimpMessagingTemplate template;

    @Autowired
    public GameController(SimpMessagingTemplate template, GameService gameService,  LobbyService lobbyService) {
        this.template = template;
        this.gameService = gameService;
        this.lobbyService = lobbyService;
    }

    // For full state sync: /game/fullStatus/{lobbyId}
    // For event state: /game/status/{lobbyId}

    @MessageMapping("/event/{lobbyId}")
    @SendTo("/game/status/{lobbyId}")
    public GameEvent eventHandling(GameEvent event, @DestinationVariable int id) {
        Game game = gameService.handleGameEvent(id, event);

        //TODO design incremental game state system at some point.
        //TODO a first idea is to use the GameEvents (Then handle them on all sides).
        String text = null;
        try {
            text = new ObjectMapper().writeValueAsString(game);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        this.template.convertAndSend("/game/fullStatus/" + id, text);
        return event;
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