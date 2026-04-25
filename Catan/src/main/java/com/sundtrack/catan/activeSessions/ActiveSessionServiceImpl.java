//package com.sundtrack.catan.activeSessions;
//
//import org.springframework.stereotype.Service;
//
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class ActiveSessionServiceImpl implements ActiveSessionService {
//
//    private final Map<String, OldLobby.LobbyIdandUsername> activeUsers = new ConcurrentHashMap<>();
//
//    @Override
//    public Map<String, OldLobby.LobbyIdandUsername> getActiveUsers() {
//        return activeUsers;
//    }
//
//    @Override
//    public void removeActiveUser(String sessionId) {
//        activeUsers.remove(sessionId);
//    }
//
//    @Override
//    public OldLobby.LobbyIdandUsername getActiveUser(String sessionId) {
//        return activeUsers.get(sessionId);
//    }
//
//    @Override
//    public void putActiveUser(String sessionId, OldLobby.LobbyIdandUsername lobbyId) {
//        activeUsers.put(sessionId, lobbyId);
//    }
//}
