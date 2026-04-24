//package com.sundtrack.catan.lobby;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sundtrack.catan.game.GameService;
//import com.sundtrack.catan.game.datalayer.domain.Game;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class LobbyServiceImpl implements LobbyService {
//
//    private final Map<Integer, Lobby> lobbies = new ConcurrentHashMap<>();
//    private GameService gameService;
//    private SimpMessagingTemplate template;
//
//    @Autowired
//    public void setGameService(GameService gameService, SimpMessagingTemplate simpMessagingTemplate) {
//        this.gameService = gameService;
//        this.template = simpMessagingTemplate;
//    }
//
//    @Override
//    public Map<Integer, Lobby> getLobbies() {
//        return lobbies;
//    }
//
//    @Override
//    public Lobby getLobby(int lobbyId) {
//        if (!lobbies.containsKey(lobbyId)) {
//            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
//        }
//
//        return lobbies.get(lobbyId);
//    }
//
//    @Override
//    public int createLobby(String username) {
//        int id = (int)(Math.random() * 1000001);
//        Lobby lobby = new Lobby();
//        lobbies.put(id, lobby);
//        return id;
//    }
//
//    @Override
//    public void removeLobby(int lobbyId) {
//        lobbies.remove(lobbyId);
//    }
//
//    @Override
//    public Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event) {
//        if(!lobbies.containsKey(lobbyId)) {
//            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
//        }
//        //TODO handle the event
//
//        switch (event.getKind()) {
//            case SETREADY -> {
//                Lobby.Player player = lobbies.get(lobbyId).getPlayer(event.getPlayerName());
//                player.setReady(true);
//            }
//            case SETNOTREADY -> {
//                Lobby.Player player = lobbies.get(lobbyId).getPlayer(event.getPlayerName());
//                player.setReady(false);
//            }
//            case STARTGAME -> {
//                System.out.println("Starting game event");
//                if (!this.getLobby(lobbyId).getPlayer(event.getPlayerName()).getIsLeader()) {
//                    return this.getLobby(lobbyId);
//                }
//                Game game = gameService.newGame(lobbyId, this.getLobby(lobbyId));
//
//                String text = null;
//                try {
//                    text = new ObjectMapper().writeValueAsString(event);
//                } catch (JsonProcessingException e) {
//                    throw new RuntimeException(e);
//                }
//
//                //Sending full state on both connections.
//                this.template.convertAndSend("/lobby/status/" + lobbyId, text);
//            }
//            default -> throw new RuntimeException("Unknown kind of event " + event.getKind());
//        }
//
//        return lobbies.get(lobbyId);
//    }
//
//    @Override
//    public Lobby joinLobby(int lobbyId, Lobby.Player player) {
//        if (!lobbies.containsKey(lobbyId)) {
//            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
//        }
//
//        lobbies.get(lobbyId).addPlayer(player);
//
//        return lobbies.get(lobbyId);
//    }
//
//    @Override
//    public Lobby leaveLobby(int lobbyId, String username) {
//        if(!lobbies.containsKey(lobbyId)) {
//            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
//        }
//
//        lobbies.get(lobbyId).removePlayer(username);
//
//        //TODO decide proper return value
//        return lobbies.get(lobbyId);
//    }
//
//}
