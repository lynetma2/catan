package com.sundtrack.catan.activeSessions;

import com.sundtrack.catan.datalayer.domain.lobby.Lobby;

import java.util.Map;

public interface ActiveSessionService {

    Map<String, Lobby.LobbyIdandUsername> getActiveUsers();
    void removeActiveUser(String sessionId);
    Lobby.LobbyIdandUsername getActiveUser(String sessionId);
    void putActiveUser(String sessionId, Lobby.LobbyIdandUsername lobbyId);

}
