package com.sundtrack.catan.lobby;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LobbyServiceImpl implements LobbyService {

    private final Map<Integer, Lobby> lobbies = new ConcurrentHashMap<>();

    @Override
    public Map<Integer, Lobby> getLobbies() {
        return lobbies;
    }

    @Override
    public Lobby getLobby(int lobbyId) {
        if (!lobbies.containsKey(lobbyId)) {
            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
        }

        return lobbies.get(lobbyId);
    }

    @Override
    public int createLobby(String username) {
        int id = (int)(Math.random() * 1000001);
        Lobby lobby = new Lobby();
        Lobby.Player player = new Lobby.Player(username, true, true);
        lobby.addPlayer(player);
        lobbies.put(id, lobby);
        return id;
    }

    @Override
    public void removeLobby(int lobbyId) {
        lobbies.remove(lobbyId);
    }

    @Override
    public Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event) {
        if(!lobbies.containsKey(lobbyId)) {
            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
        }
        //TODO handle the event

        switch (event.getKind()) {
            case SETREADY -> {
                Lobby.Player player = lobbies.get(lobbyId).getPlayer(event.getPlayerName());
                player.setReady(true);
            }
            case SETNOTREADY -> {
                Lobby.Player player = lobbies.get(lobbyId).getPlayer(event.getPlayerName());
                player.setReady(false);
            }
            case STARTGAME -> {
                System.out.println("Starting game event");
            }
            default -> throw new RuntimeException("Unknown kind of event " + event.getKind());
        }

        return lobbies.get(lobbyId);
    }

    @Override
    public Lobby joinLobby(int lobbyId, Lobby.Player player) {
        if (!lobbies.containsKey(lobbyId)) {
            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
        }

        lobbies.get(lobbyId).addPlayer(player);

        return lobbies.get(lobbyId);
    }

    @Override
    public Lobby leaveLobby(int lobbyId, String username) {
        if(!lobbies.containsKey(lobbyId)) {
            throw new RuntimeException("Lobby with lobbyId " + lobbyId + " does not exist");
        }

        lobbies.get(lobbyId).removePlayer(username);

        //TODO decide proper return value
        return lobbies.get(lobbyId);
    }
}
