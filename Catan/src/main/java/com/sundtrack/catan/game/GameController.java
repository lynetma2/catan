package com.sundtrack.catan.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.game.entity.Board;
import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.MapBuilder;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.messaging.Events.GameEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.HashMap;

@Controller
@CrossOrigin(origins = "*")
@MessageMapping("/game")
public class GameController {

    private static final HashMap<Integer, Game> games = new HashMap<>();
    private SimpMessagingTemplate template;

    @Autowired
    public GameController(SimpMessagingTemplate template) {
        this.template = template;
    }

    // For full state sync: /game/fullStatus/{lobbyId}
    // For event state: /game/status/{lobbyId}

    @MessageMapping("/event/{lobbyId}")
    @SendTo("/game/status/{lobbyId}")
    public GameEvent eventHandling(GameEvent event, @DestinationVariable int id) {
        System.out.println("Got Game Event of kind: " + event.getKind());
        //TODO add event handling and verification of the event.
        if (!games.containsKey(id)) {
            throw new RuntimeException("Game with lobbyId " + id + " not found");
        }

        //TODO design incremental game state system at some point.
        //TODO a first idea is to use the GameEvents (Then handle them on all sides).
        String text = null;
        try {
            text = new ObjectMapper().writeValueAsString(games.get(id));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        this.template.convertAndSend("/game/fullStatus/" + id, text);
        return event;
    }

    //TODO handle the generation of games not as websocket communication
    //TODO create something to handle lobbies.
    public void newGame(int lobbyId, Lobby lobby) {
        ArrayList<Player> newPlayers = new ArrayList<>();
        lobby.getPlayers().values().forEach(player -> {
            newPlayers.add(new Player(player.getUsername()));
        });
        games.put(lobbyId, new Game(new Board(MapBuilder.classicNotRandom()), newPlayers));

        String text = null;
        try {
            text = new ObjectMapper().writeValueAsString(games.get(lobbyId));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        this.template.convertAndSend("/game/status/" + lobbyId, text);
        this.template.convertAndSend("/game/fullStatus/" + lobbyId, text);
    }



}