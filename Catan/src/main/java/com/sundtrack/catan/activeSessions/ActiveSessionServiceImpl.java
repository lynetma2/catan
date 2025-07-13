package com.sundtrack.catan.activeSessions;

import com.sundtrack.catan.lobby.Lobby;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ActiveSessionServiceImpl implements ActiveSessionService {

    private final Map<String, Lobby.LobbyIdandUsername> activeUsers = new ConcurrentHashMap<>();

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
