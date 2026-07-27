package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.resource.GameDiscardAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.PlayerNotPendingDiscardException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.*;

public class DiscardFlow implements SubFlow {
    private final Map<UUID, Integer> requiredDiscards;
    private final Set<UUID> pendingPlayers;

    public DiscardFlow(Map<UUID, Integer> requiredDiscards) {
        this.requiredDiscards = Map.copyOf(requiredDiscards);
        this.pendingPlayers = new HashSet<>(requiredDiscards.keySet());
    }

    public Map<UUID, Integer> getRequiredDiscards() {
        return requiredDiscards;
    }

    public boolean isPending(UUID playerId) {
        return pendingPlayers.contains(playerId);
    }

    public Map<UUID, Integer> getPendingRequireDiscards() {
        Map<UUID, Integer> pending = new HashMap<>();
        for (UUID playerId : pendingPlayers) {
            pending.put(playerId, getRequiredCount(playerId));
        }
        return pending;
    }

    public int getRequiredCount(UUID playerId) {
        return requiredDiscards.getOrDefault(playerId, 0);
    }

    @Override
    public GamePhase currentPhase() {
        return GamePhase.DISCARD;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId) {
        if (!(action instanceof GameDiscardAction)) {
            throw new IllegalStateException(
                    "DiscardFlow.handle called with " + action.getClass().getSimpleName());
        }
        if (!pendingPlayers.contains(actingPlayerId)) {
            throw new PlayerNotPendingDiscardException(actingPlayerId);
        }
        pendingPlayers.remove(actingPlayerId);
        return pendingPlayers.isEmpty() ? Optional.empty() : Optional.of(this);
    }
}
