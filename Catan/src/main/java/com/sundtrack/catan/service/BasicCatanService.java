package com.sundtrack.catan.service;

import com.sundtrack.catan.game.entity.Board;
import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.MapBuilder;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.lobby.LobbyMessages;
import com.sundtrack.catan.messaging.Events.GameEvent;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BasicCatanService implements CatanService {
    //TODO at one point this should be moved to repository storage.
    private final Map<Integer, Lobby> lobbies = new ConcurrentHashMap<>();
    private final Map<Integer, Game> games = new ConcurrentHashMap<>();
    private final Map<String, Lobby.LobbyIdandUsername> activeUsers = new ConcurrentHashMap<>();

    @Override
    public Map<Integer, Lobby> getLobbies() {
        return lobbies;
    }

    @Override
    public Lobby getLobby(int lobbyId) {
        return lobbies.get(lobbyId);
    }

    @Override
    public LobbyMessages.NewLobby newLobby(LobbyMessages.PlayerNameMessage playerNameMessage) {
        int id = (int)(Math.random() * 1000001);
        Lobby lobby = new Lobby();
        Lobby.Player player = new Lobby.Player(playerNameMessage.playerName(), true, true);
        lobby.getPlayers().put(playerNameMessage.playerName(), player);
        lobbies.put(id, lobby);
        System.out.println("This is a test from inside the newLobby");

        return new LobbyMessages.NewLobby(id, lobby);
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
        System.out.println("Lobby event happened");

        switch (event.getKind()) {
            case SETREADY -> {
                Lobby.Player player = lobbies.get(lobbyId).getPlayers().get(event.getPlayerName());
                player.setReady(true);
            }
            case SETNOTREADY -> {
                Lobby.Player player = lobbies.get(lobbyId).getPlayers().get(event.getPlayerName());
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
    public Map<Integer, Game> getGames() {
        return games;
    }

    @Override
    public Game getGame(int gameId) {
        return games.get(gameId);
    }

    @Override
    public Game newGame(int lobbyId, Lobby lobby) {
        ArrayList<Player> newPlayers = new ArrayList<>();
        lobby.getPlayers().values().forEach(player -> {
            newPlayers.add(new Player(player.getUsername()));
        });
        games.put(lobbyId, new Game(new Board(MapBuilder.classicNotRandom()), newPlayers));

        return games.get(lobbyId);
    }

    @Override
    public void removeGame(int gameId) {
        games.remove(gameId);
    }

    @Override
    public Game handleGameEvent(int gameId, GameEvent event) {
        System.out.println("Got Game Event of kind: " + event.getKind());
        //TODO add event handling and verification of the event.
        if (!games.containsKey(gameId)) {
            throw new RuntimeException("Game with lobbyId " + gameId + " not found");
        }

        return games.get(gameId);
    }

    @Override
    public Map<String, Lobby.LobbyIdandUsername> getActiveUsers() {
        return activeUsers;
    }

    @Override
    public void removeActiveUser(String sessionId) {
        activeUsers.remove(sessionId);
    }

    @Override
    public Lobby.LobbyIdandUsername getActiveUser(String sessionId) {
        return activeUsers.get(sessionId);
    }

    @Override
    public void putActiveUser(String sessionId, Lobby.LobbyIdandUsername lobbyId) {
        activeUsers.put(sessionId, lobbyId);
    }
}
