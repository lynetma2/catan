package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.resource.GameDiscardAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class DiscardFlow implements SubFlow {
    private final Map<UUID, Integer> remaining; // mutated in place — see note below

    public DiscardFlow(Map<UUID, Integer> requiredDiscards) {
        this.remaining = new HashMap<>(requiredDiscards);
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action) {
        if (!(action instanceof GameDiscardAction discard)) throw new IllegalGamePhaseException(currentPhase());
        int left = remaining.getOrDefault(discard.playerId(), 0) - discard.resources().size();
        if (left > 0) remaining.put(discard.playerId(), left);
        else remaining.remove(discard.playerId());
        return remaining.isEmpty() ? Optional.empty() : Optional.of(this);
    }

    @Override
    public GamePhase currentPhase() {
        return GamePhase.DISCARD;
    }
}
