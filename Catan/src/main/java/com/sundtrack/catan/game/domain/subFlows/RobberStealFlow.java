package com.sundtrack.catan.game.domain.subFlows;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.game.domain.event.action.robber.RobberStealAction;
import com.sundtrack.catan.game.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.game.domain.exceptions.validation.InvalidStealTargetException;
import com.sundtrack.catan.game.domain.GamePhase;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class RobberStealFlow implements SubFlow {
    private final UUID retrievingPlayerId;
    private final List<UUID> candidates;

    public RobberStealFlow(UUID retrievingPlayerId, List<UUID> candidates) {
        this.retrievingPlayerId = retrievingPlayerId;
        this.candidates = candidates;
    }

    public UUID getRetrievingPlayerId() {
        return retrievingPlayerId;
    }

    public List<UUID> getCandidates() {
        return candidates;
    }

    @Override
    public GamePhase currentPhase() {
        return GamePhase.ROBBER_STEAL;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId) {
        if (!(action instanceof RobberStealAction(UUID targetPlayerId)))
            throw new IllegalGamePhaseException(currentPhase());
        if (!candidates.contains(targetPlayerId)) throw new InvalidStealTargetException(targetPlayerId);
        return Optional.empty();
    }
}