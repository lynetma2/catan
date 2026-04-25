package com.sundtrack.catan.session.lobby.services;

import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LobbyStore {
    private final ConcurrentHashMap<UUID, Lobby> lobbyMap = new ConcurrentHashMap<>();

    public Lobby get(UUID uuid) {
        return lobbyMap.get(uuid);
    }

    public void add(UUID uuid, Lobby lobby) {
        lobbyMap.put(uuid, lobby);
    }

    public void remove(UUID uuid) {
        lobbyMap.remove(uuid);
    }

    public void persist(Lobby lobby) {
        // Implementation will come later, when it is decided how it should be implemented.
    }
}
