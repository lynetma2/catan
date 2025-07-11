package com.sundtrack.catan;

import com.sundtrack.catan.game.Board;
import com.sundtrack.catan.game.Game;
import com.sundtrack.catan.game.MapBuilder;
import com.sundtrack.catan.game.Player;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.lobby.Messages;
import com.sundtrack.catan.messaging.Events.GameEvent;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class BasicCatanService implements CatanService {
    //TODO at one point this should be moved to repository storage.
    HashMap<Integer, Lobby> lobbies = new HashMap<>();
    HashMap<Integer, Game> games = new HashMap<>();
    HashMap<String, Lobby.LobbyIdandUsername> activeUsers = new HashMap<>();

    @Override
    public HashMap<Integer, Lobby> getLobbies() {
        return lobbies;
    }

    @Override
    public Lobby getLobby(int lobbyId) {
        return lobbies.get(lobbyId);
    }

    @Override
    public Messages.NewLobby newLobby(Messages.PlayerMessage playerMessage) {
        int id = (int)(Math.random() * 1000001);
        Lobby lobby = new Lobby();
        Lobby.Player player = new Lobby.Player(playerMessage.playerName(), true, true);
        lobby.getPlayers().put(playerMessage.playerName(), player);
        lobbies.put(id, lobby);

        return new Messages.NewLobby(id, lobby);
    }

    @Override
    public void removeLobby(int lobbyId) {
        lobbies.remove(lobbyId);
    }

    @Override
    public Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event) {
        if(!lobbies.containsKey(lobbyId)) {
            throw new RuntimeException("Lobby with id " + lobbyId + " does not exist");
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
    public HashMap<Integer, Game> getGames() {
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
            throw new RuntimeException("Game with id " + gameId + " not found");
        }

        return games.get(gameId);
    }

    @Override
    public HashMap<String, Lobby.LobbyIdandUsername> getActiveUsers() {
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
