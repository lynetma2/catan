package com.sundtrack.catan.messaging;

import com.sundtrack.catan.game.Board;
import com.sundtrack.catan.game.Game;
import com.sundtrack.catan.game.MapBuilder;
import com.sundtrack.catan.game.Player;
import com.sundtrack.catan.messaging.Events.GameEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;

@Controller
@CrossOrigin(origins = "*")
@MessageMapping("/game")
public class GameController {

    private static final HashMap<Integer, Game> games = new HashMap<>();

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting(new Board(MapBuilder.classicNotRandom()));
        //return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

    @MessageMapping("/synchronize/{id}")
    @SendTo("/game/fullStatus/{id}")
    public Game getFullStatus(@DestinationVariable int id) {
        if (games.containsKey(id)) {
            return games.get(id);
        } else {
            throw new RuntimeException("Game with id " + id + " not found");
        }
    }

    @MessageMapping("/event/{id}")
    @SendTo("/game/status/{id}")
    public Game eventHandling(GameEvent event, @DestinationVariable int id) {
        System.out.println(event.getKind());
        //TODO add event handling and verification of the event.
        if (!games.containsKey(id)) {
            throw new RuntimeException("Game with id " + id + " not found");
        }

        //TODO design incremental game state system at some point.
        //TODO a first idea is to use the GameEvents (Then handle them on all sides).
        return games.get(id);
    }


    //TODO handle the generation of games not as websocket communication
    //TODO create something to handle lobbies.
    @PostMapping("/game/newGame")
    public ResponseEntity<NewGameMessage> newGame() {
        int newId = games.size() + 1;
        ArrayList<Player> newPlayers = new ArrayList<>();
        newPlayers.add(new Player("player1"));
        newPlayers.add(new Player("player2"));
        games.put(newId, new Game(new Board(MapBuilder.classicNotRandom()), newPlayers));
        return ResponseEntity.ok(new NewGameMessage(newId));
    }

}