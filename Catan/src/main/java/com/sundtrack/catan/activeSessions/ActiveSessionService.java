package com.sundtrack.catan.activeSessions;

import com.sundtrack.catan.lobby.Lobby;

import java.util.Map;

public interface ActiveSessionService {

    Map<String, Lobby.LobbyIdandUsername> getActiveUsers();
    void removeActiveUser(String sessionId);
    Lobby.LobbyIdandUsername getActiveUser(String sessionId);
    void putActiveUser(String sessionId, Lobby.LobbyIdandUsername lobbyId);

}
