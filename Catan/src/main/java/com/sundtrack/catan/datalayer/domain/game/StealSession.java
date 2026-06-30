package com.sundtrack.catan.datalayer.domain.game;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public class StealSession {
    private boolean isActive;
    private UUID retrievingPlayerId;
    private List<UUID> candidates;

    public StealSession() {
        this.isActive = false;
        this.retrievingPlayerId = null;
        this.candidates = null;
    }

    public void activate(UUID retrievingPlayerId, List<UUID> candidates) {
        this.isActive = true;
        this.retrievingPlayerId = retrievingPlayerId;
        this.candidates = candidates;
    }

    public void deactivate() {
        this.isActive = false;
        this.retrievingPlayerId = null;
        this.candidates = null;
    }

    public boolean isActive() {
        return isActive;
    }

    public UUID getRetrievingPlayerId() {
        return retrievingPlayerId;
    }

    public List<UUID> getCandidates() {
        return candidates;
    }
}
