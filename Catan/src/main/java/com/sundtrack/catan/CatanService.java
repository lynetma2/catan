package com.sundtrack.catan;


import com.sundtrack.catan.game.Game;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.lobby.Messages;
import com.sundtrack.catan.messaging.Events.GameEvent;

import java.util.HashMap;

public interface CatanService {
    //Lobby related methods
    HashMap<Integer, Lobby> getLobbies();
    Lobby getLobby(int lobbyId);
    Messages.NewLobby newLobby(Messages.PlayerMessage playerMessage);
    void removeLobby(int lobbyId);
    Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event);

    //Game related methods
    HashMap<Integer, Game> getGames();
    Game getGame(int gameId);
    Game newGame(int lobbyId, Lobby lobby);
    void removeGame(int gameId);
    Game handleGameEvent(int gameId, GameEvent event);

    //TODO (Very late) add chat stuff.

    //Connection related methods
    HashMap<String, Lobby.LobbyIdandUsername> getActiveUsers();
    void removeActiveUser(String sessionId);
    Lobby.LobbyIdandUsername getActiveUser(String sessionId);
    void putActiveUser(String sessionId, Lobby.LobbyIdandUsername lobbyId);


}
