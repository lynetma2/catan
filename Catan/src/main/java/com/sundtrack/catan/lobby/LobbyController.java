//package com.sundtrack.catan.lobby;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sundtrack.catan.activeSessions.ActiveSessionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.Header;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.socket.messaging.SessionConnectEvent;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//
//@Controller
//@CrossOrigin(origins = "*")
//@MessageMapping("/lobby")
//public class LobbyController {
//
//    private final LobbyService lobbyService;
//    private final ActiveSessionService activeSessionService;
//    private SimpMessagingTemplate template;
//
//    @Autowired
//    public LobbyController(ActiveSessionService activeSessionService, LobbyService lobbyService, SimpMessagingTemplate template) {
//        this.lobbyService = lobbyService;
//        this.activeSessionService = activeSessionService;
//        this.template = template;
//    }
//
//    @PostMapping("/lobby/new")
//    @ResponseBody
//    public LobbyMessages.LobbyIdMessage newLobby(@RequestBody LobbyMessages.PlayerNameMessage playerMessage) {
//        int lobbyId = lobbyService.createLobby(playerMessage.playerName());
//
//        return new LobbyMessages.LobbyIdMessage(lobbyId);
//    }
//
//    @MessageMapping("/join/{lobbyId}")
//    @SendTo("/lobby/status/{lobbyId}")
//    public Lobby joinLobby(@Header("simpSessionId") String sessionId, @DestinationVariable Integer lobbyId, LobbyMessages.PlayerNameMessage playerNameMessage) {
//
//        //Storing session information
//        activeSessionService.putActiveUser(sessionId, new Lobby.LobbyIdandUsername(playerNameMessage.playerName(), lobbyId));
//
//        //TODO Somehow check if the user should be the new leader.
//        boolean isLeader = false;
//        if (lobbyService.getLobby(lobbyId).getPlayers().isEmpty()){
//            isLeader = true;
//        } else if(lobbyService.getLobby(lobbyId).getPlayers().size() == 1){
//            isLeader = lobbyService.getLobby(lobbyId).getPlayers().containsKey(playerNameMessage.playerName());
//        }
//        Lobby.Player player = new Lobby.Player(playerNameMessage.playerName(), isLeader, isLeader);
//        //TODO decide proper return value
//        return lobbyService.joinLobby(lobbyId, player);
//    }
//
//    @MessageMapping("/leave/{lobbyId}")
//    @SendTo("/lobby/status/{lobbyId}")
//    public Lobby leaveLobby(@DestinationVariable Integer lobbyId, LobbyMessages.PlayerNameMessage playerNameMessage) {
//        return lobbyService.leaveLobby(lobbyId, playerNameMessage.playerName());
//    }
//
//    //TODO add the possibility to start a game from the lobby leader (First username)
//
//
//    //TODO add ready check in the lobby
//    @MessageMapping("/event/{lobbyId}")
//    @SendTo("/lobby/status/{lobbyId}")
//    public Lobby event(@DestinationVariable Integer lobbyId, Lobby.LobbyEvent event) {
//        return lobbyService.handleLobbyEvent(lobbyId, event);
//    }
//
//    @EventListener(SessionDisconnectEvent.class)
//    public void handleDisconnect(SessionDisconnectEvent event) {
//        //System.out.println("SessionDisconnectEvent = " + event);
//        if (activeSessionService.getActiveUsers().containsKey(event.getSessionId())) {
//            Lobby.LobbyIdandUsername activeUser = activeSessionService.getActiveUser(event.getSessionId());
//            lobbyService.getLobby(activeUser.lobbyId()).removePlayer(activeUser.username());
//            //TODO check if the lobby is empty... Maybe this should be done inside the removePlayer call somehow.
//
//            activeSessionService.removeActiveUser(event.getSessionId());
//            String text = null;
//            try {
//                text = new ObjectMapper().writeValueAsString(lobbyService.getLobby(activeUser.lobbyId()));
//            } catch (JsonProcessingException e) {
//                throw new RuntimeException(e);
//            }
//
//            this.template.convertAndSend("/lobby/status/" + activeUser.lobbyId(), text);
//        }
//        //TODO intercept connection closing and the close the lobby if empty
//    }
//
//    //TODO (Very late) add chat in the lobby
//
//}
