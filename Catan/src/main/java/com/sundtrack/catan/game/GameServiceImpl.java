package com.sundtrack.catan.game;

import com.sundtrack.catan.game.model.Game;
import com.sundtrack.catan.game.services.BoardService;
import com.sundtrack.catan.game.services.GameEventExecutor;
import com.sundtrack.catan.game.model.player.Player;
import com.sundtrack.catan.game.dto.events.GameEvent;
import com.sundtrack.catan.lobby.Lobby;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameServiceImpl implements GameService {

    private final Map<Integer, Game> games = new ConcurrentHashMap<>();
    private final BoardService boardService;
    private final GameEventExecutor gameEventExecutor;

    public GameServiceImpl(BoardService boardService, GameEventExecutor gameEventExecutor) {
        this.boardService = boardService;
        this.gameEventExecutor = gameEventExecutor;
    }

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
            newPlayers.put(player.getUsername(), new Player(player.getUsername(), null)); // Assuming style is null for now or handled elsewhere
        });
        games.put(lobbyId, new Game(boardService.createClassicBoard(), newPlayers));

        return games.get(lobbyId);
    }

    @Override
    public void removeGame(int gameId) {
        games.remove(gameId);
    }

    @Override
    public Game handleGameEvent(int gameId, GameEvent event) {
        if (!games.containsKey(gameId)) {
            throw new RuntimeException("Game with lobbyId " + gameId + " not found");
        }

        Game game = games.get(gameId);
        gameEventExecutor.executeEvent(game, event);

        return game;
    }
}
