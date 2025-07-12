package com.sundtrack.catan.lobby;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.service.CatanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@CrossOrigin(origins = "*")
@MessageMapping("/lobby")
public class LobbyController {

    private final CatanService catanService;
    private SimpMessagingTemplate template;

    @Autowired
    public LobbyController(CatanService catanService, SimpMessagingTemplate template) {
        this.catanService = catanService;
        this.template = template;
    }

    @PostMapping("/lobby/new")
    @ResponseBody
    public Messages.NewLobby newLobby( @RequestBody Messages.PlayerMessage playerMessage) {
        return catanService.newLobby(playerMessage);
    }

    @MessageMapping("/join/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby joinLobby(@Header("simpSessionId") String sessionId, @DestinationVariable Integer id, Messages.PlayerMessage playerMessage) {
        if(!catanService.getLobbies().containsKey(id)) {
            throw new RuntimeException("Lobby with id " + id + " does not exist");
        }
        //Storing session information
        catanService.getActiveUsers().put(sessionId, new Lobby.LobbyIdandUsername(playerMessage.playerName(), id));

        Lobby.Player player = new Lobby.Player(playerMessage.playerName(), false, false);
        catanService.getLobby(id).getPlayers().put(playerMessage.playerName(), player);
        //TODO decide proper return value
        return catanService.getLobby(id);
    }

    @MessageMapping("/leave/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby leaveLobby(@DestinationVariable Integer id, Messages.PlayerMessage playerMessage) {
        if(!catanService.getLobbies().containsKey(id)) {
            throw new RuntimeException("Lobby with id " + id + " does not exist");
        }
        catanService.getLobby(id).getPlayers().remove(playerMessage.playerName());
        //TODO decide proper return value
        return catanService.getLobby(id);
    }

    //TODO add the possibility to start a game from the lobby leader (First username)


    //TODO add ready check in the lobby
    @MessageMapping("/event/{id}")
    @SendTo("/lobby/status/{id}")
    public Lobby event(@DestinationVariable Integer id, Lobby.LobbyEvent event) {
        return catanService.handleLobbyEvent(id, event);
    }

    @EventListener(SessionDisconnectEvent.class)
    public void handleDisconnect(SessionDisconnectEvent event) {
        //System.out.println("SessionDisconnectEvent = " + event);
        if (catanService.getActiveUsers().containsKey(event.getSessionId())) {
            Lobby.LobbyIdandUsername collection = catanService.getActiveUsers().get(event.getSessionId());
            if(!catanService.getLobbies().containsKey(collection.id())) {
                throw new RuntimeException("Lobby with id " + collection.id() + " does not exist");
            }
            catanService.getLobbies().get(collection.id()).getPlayers().remove(collection.username());

            //TODO check if the lobby is empty

            catanService.getActiveUsers().remove(event.getSessionId());
            String text = null;
            try {
                text = new ObjectMapper().writeValueAsString(catanService.getLobbies().get(collection.id()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

            this.template.convertAndSend("/lobby/status/" + collection.id(), text);
        }
        //TODO intercept connection closing and the close the lobby if empty
    }

    @EventListener(SessionConnectEvent.class)
    public void handleConnect(SessionConnectEvent event) {
        //System.out.println("SessionConnectEvent = " + event);
        //TODO somehow get a link between the session Id and the lobby id and playerName.
    }


    //TODO (Very late) add chat in the lobby

}
