package com.sundtrack.catan.game;

import com.sundtrack.catan.game.model.Game;
import com.sundtrack.catan.game.dto.events.GameEvent;
import com.sundtrack.catan.lobby.Lobby;
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
