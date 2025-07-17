package com.sundtrack.catan.game;

import com.sundtrack.catan.game.entity.Board;
import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.game.entity.MapBuilder;
import com.sundtrack.catan.game.entity.Player;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.game.Events.GameEvent;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameServiceImpl implements GameService {

    private final Map<Integer, Game> games = new ConcurrentHashMap<>();

    @Override
    public Map<Integer, Game> getGames() {
        return games;
    }

    @Override
    public Game getGame(int gameId) {
        if (!games.containsKey(gameId)) {
            throw new RuntimeException("Game with id " + gameId + " does not exist");
        }

        return games.get(gameId);
    }

    @Override
    public Game newGame(int lobbyId, Lobby lobby) {
        Map<String, Player> newPlayers = new HashMap<>();
        lobby.getPlayers().values().forEach(player -> {
            newPlayers.put(player.getUsername(), new Player(player.getUsername()));
        });
        games.put(lobbyId, new Game(MapBuilder.classicNotRandom(), newPlayers));

        return games.get(lobbyId);
    }

    @Override
    public void removeGame(int gameId) {
        games.remove(gameId);
    }

    @Override
    public Game handleGameEvent(int gameId, GameEvent event) {
        //TODO add event handling and verification of the event.
        if (!games.containsKey(gameId)) {
            throw new RuntimeException("Game with lobbyId " + gameId + " not found");
        }

        Game game = games.get(gameId);
        game.handleGameEvent(event);

        return game;
    }
}
