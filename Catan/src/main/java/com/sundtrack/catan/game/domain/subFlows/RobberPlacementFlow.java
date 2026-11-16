package com.sundtrack.catan.game.domain.subFlows;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.game.domain.event.action.robber.PlaceRobberAction;
import com.sundtrack.catan.game.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.game.domain.GamePhase;

import java.util.Optional;
import java.util.UUID;

public class RobberPlacementFlow implements SubFlow {
    @Override
    public GamePhase currentPhase() {
        return GamePhase.ROBBER_PLACEMENT;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId) {
        if (!(action instanceof PlaceRobberAction)) throw new IllegalGamePhaseException(currentPhase());
        return Optional.empty(); // always a single step; Game decides what (if anything) comes next
    }
}
