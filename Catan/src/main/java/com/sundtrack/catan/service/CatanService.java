package com.sundtrack.catan.service;


import com.sundtrack.catan.game.entity.Game;
import com.sundtrack.catan.lobby.Lobby;
import com.sundtrack.catan.lobby.LobbyMessages;
import com.sundtrack.catan.messaging.Events.GameEvent;

import java.util.Map;

public interface CatanService {
    //Lobby related methods
    Map<Integer, Lobby> getLobbies();
    Lobby getLobby(int lobbyId);
    LobbyMessages.NewLobby newLobby(LobbyMessages.PlayerNameMessage playerNameMessage);
    void removeLobby(int lobbyId);
    Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event);

    //Game related methods
    Map<Integer, Game> getGames();
    Game getGame(int gameId);
    Game newGame(int lobbyId, Lobby lobby);
    void removeGame(int gameId);
    Game handleGameEvent(int gameId, GameEvent event);

    //TODO (Very late) add chat stuff.

    //Connection related methods
    Map<String, Lobby.LobbyIdandUsername> getActiveUsers();
    void removeActiveUser(String sessionId);
    Lobby.LobbyIdandUsername getActiveUser(String sessionId);
    void putActiveUser(String sessionId, Lobby.LobbyIdandUsername lobbyId);


}
