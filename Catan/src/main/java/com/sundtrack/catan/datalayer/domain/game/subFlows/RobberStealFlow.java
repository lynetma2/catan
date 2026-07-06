package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.RobberStealAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InvalidStealTargetException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class RobberStealFlow implements SubFlow {
    private final List<UUID> candidates;

    public RobberStealFlow(List<UUID> candidates) {
        this.candidates = candidates;
    }

    @Override
    public GamePhase currentPhase() {
        return GamePhase.ROBBER_STEAL;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action) {
        if (!(action instanceof RobberStealAction(UUID targetPlayerId)))
            throw new IllegalGamePhaseException(currentPhase());
        if (!candidates.contains(targetPlayerId)) throw new InvalidStealTargetException(targetPlayerId);
        return Optional.empty();
    }
}