package com.sundtrack.catan.datalayer.domain.lobby;

import java.util.UUID;

public class LobbyPlayer {
    private UUID id;
    private String username;
    private boolean isLeader;
    private boolean isReady;

    public LobbyPlayer(UUID id, String username, boolean isLeader, boolean isReady) {
        this.id = id;
        this.username = username;
        this.isLeader = isLeader;
        this.isReady = isReady;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isLeader() {
        return isLeader;
    }

    public void setIsLeader(boolean leader) {
        isLeader = leader;
    }

    public boolean isReady() {
        return isReady;
    }

    public void setReady(boolean ready) {
        isReady = ready;
    }
}
