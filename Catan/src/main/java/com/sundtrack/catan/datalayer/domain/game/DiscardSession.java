package com.sundtrack.catan.datalayer.domain.game;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class DiscardSession {
    private boolean isActive;
    private Map<UUID, Integer> requiredDiscards;
    private Set<UUID> pendingPLayers;

    public DiscardSession() {
        this.isActive = false;
        this.requiredDiscards = null;
        this.pendingPLayers = null;
    }

    public void activate(Map<UUID, Integer> requiredDiscards) {
        this.isActive = true;
        this.requiredDiscards = requiredDiscards;
        this.pendingPLayers = requiredDiscards.keySet();
    }

    public void deactivate() {
        this.isActive = false;
        this.requiredDiscards = null;
        this.pendingPLayers = null;
    }

    public Map<UUID, Integer> getRequiredDiscards() {
        return requiredDiscards;
    }

    public boolean isPending(UUID playerId) {
        return pendingPLayers.contains(playerId);
    }

    public int getRequiredCount(UUID playerId) {
        return requiredDiscards.getOrDefault(playerId, 0);
    }

    public void markDiscarded(UUID playerId) {
        pendingPLayers.remove(playerId);
    }

    public boolean isComplete() {
        return isActive && pendingPLayers.isEmpty();
    }
}
