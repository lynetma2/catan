package com.sundtrack.catan.game;

import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.game.Events.GameEvent;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface GameService {

    Map<Integer, Game> getGames();
    Game getGame(int gameId);
    Game newGame(int lobbyId, Lobby lobby);
    void removeGame(int gameId);
    Game handleGameEvent(int gameId, GameEvent event);

}
