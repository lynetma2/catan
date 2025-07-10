package com.sundtrack.catan.lobby;

import com.sundtrack.catan.game.Board;
import com.sundtrack.catan.game.MapBuilder;
import com.sundtrack.catan.messaging.Greeting;
import com.sundtrack.catan.messaging.HelloMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;

@Controller
@CrossOrigin(origins = "*")
@MessageMapping("/lobby")
public class LobbyController {

    HashMap<Integer, Lobby> lobbies = new HashMap<>();

    @PostMapping("/lobby/new")
    @ResponseBody
    public Messages.NewLobby newLobby(@RequestBody Messages.PlayerMessage playerMessage) {
        System.out.println("New Lobby event happened");
        System.out.println(playerMessage);
        int id = (int)(Math.random() * 1000001);
        Lobby lobby = new Lobby();
        lobby.getPlayers().put(playerMessage.playerName(), true);
        lobbies.put(id, lobby);
        return new Messages.NewLobby(id, lobby);
    }

    @MessageMapping("/join/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby joinLobby(@DestinationVariable Integer id, Messages.PlayerMessage playerMessage) {
        if(!lobbies.containsKey(id)) {
            throw new RuntimeException("Lobby with id " + id + " does not exist");
        }
        lobbies.get(id).getPlayers().put(playerMessage.playerName(), false);
        //TODO decide proper return value
        return lobbies.get(id);
    }

    @MessageMapping("/leave/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby leaveLobby(@DestinationVariable Integer id, Messages.PlayerMessage playerMessage) {
        if(!lobbies.containsKey(id)) {
            throw new RuntimeException("Lobby with id " + id + " does not exist");
        }
        lobbies.get(id).getPlayers().remove(playerMessage.playerName());
        //TODO decide proper return value
        return lobbies.get(id);
    }

    //TODO add the possibility to start a game from the lobby leader (First username)


    //TODO add ready check in the lobby
    @MessageMapping("/event/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby event(@DestinationVariable Integer id, LobbyEvent event) {
        if(!lobbies.containsKey(id)) {
            throw new RuntimeException("Lobby with id " + id + " does not exist");
        }
        //TODO handle the event

        switch (event.getKind()) {
            case SETREADY -> lobbies.get(id).getPlayers().put(event.getPlayer(), true);
            case SETNOTREADY -> lobbies.get(id).getPlayers().put(event.getPlayer(), false);
            case STARTGAME -> System.out.println("Starting game, event nothing happened");
            default -> throw new RuntimeException("Unknown kind of event " + event.getKind());
        }

        return lobbies.get(id);
    }

    //TODO intercept connection closing and the close the lobby if empty

    //TODO (Very late) add chat in the lobby

    public class LobbyEvent {
        enum EventKind {
            SETREADY,
            SETNOTREADY,
            STARTGAME,
            //TODO add some to handle settings
        }

        private final EventKind kind;
        private final String player;

        public  LobbyEvent(EventKind kind, String player) {
            this.kind = kind;
            this.player = player;
        }

        public EventKind getKind() {
            return kind;
        }

        public String getPlayer() {
            return player;
        }
    }
}
