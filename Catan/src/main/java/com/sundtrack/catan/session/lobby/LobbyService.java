package com.sundtrack.catan.session.lobby;

import java.util.Map;

public interface LobbyService {

    Map<Integer, Lobby> getLobbies();
    Lobby getLobby(int lobbyId);
    int createLobby(String username);
    void removeLobby(int lobbyId);
    Lobby handleLobbyEvent(int lobbyId, Lobby.LobbyEvent event);
    Lobby joinLobby(int lobbyId, Lobby.LobbyPlayer lobbyPlayer);
    Lobby leaveLobby(int lobbyId, String username);

}
