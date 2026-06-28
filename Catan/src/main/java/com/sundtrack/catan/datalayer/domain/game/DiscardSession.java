package com.sundtrack.catan.datalayer.domain.game;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class DiscardSession {
    private final Map<UUID, Integer> requiredDiscards;
    private final Set<UUID> pendingPLayers;

    public DiscardSession(Map<UUID, Integer> requiredDiscards) {
        this.requiredDiscards = requiredDiscards;
        this.pendingPLayers = requiredDiscards.keySet();
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
        return pendingPLayers.isEmpty();
    }
}
