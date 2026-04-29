package com.sundtrack.catan.datalayer.domain.lobby;

import java.util.*;

public class Lobby {
    private UUID id;
    private Map<UUID, LobbyPlayer> players;
    private boolean gameStarted;

    public Lobby(LobbyPlayer firstPlayer) {
        this.id = UUID.randomUUID();
        this.players = new HashMap<>();
        this.players.put(firstPlayer.getId(), firstPlayer);
    }

    public UUID getId() {
        return id;
    }

    public Map<UUID, LobbyPlayer> getPlayers() {
        return players;
    }

    public void addPlayer(LobbyPlayer lobbyPlayer) {
        this.players.put(lobbyPlayer.getId(), lobbyPlayer);
    }

    public void removePlayer(UUID playerId) {
        this.players.remove(playerId);
    }

    public boolean isFull() {
        return this.players.size() >= 4;
    }

    public boolean isEmpty() {
        return this.players.isEmpty();
    }

    public boolean isNotEmpty() {
        return !this.isEmpty();
    }

    public boolean hasStarted() {
        return gameStarted;
    }

    public void setStarted(boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

    public void setReady(UUID playerId) {
        this.players.get(playerId).setReady(true);
    }

    public void setUnready(UUID playerId) {
        this.players.get(playerId).setReady(false);
    }

    public boolean isLeader(UUID playerId) {
        return this.players.get(playerId).isLeader();
    }

    public boolean allPlayersReady() {
        return players.values().stream().allMatch(LobbyPlayer::isReady);
    }

    public int playerCount() {
        return players.size();
    }

    public Set<UUID> getPlayerIds() {
        return players.keySet();
    }

    public void markAsStarted() {
        this.gameStarted = true;
    }

    public boolean hasPlayer(UUID playerId) {
        return this.players.containsKey(playerId);
    }
}
