package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.PlaceRobberAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.Optional;

public class RobberPlacementFlow implements SubFlow {
    @Override
    public GamePhase currentPhase() {
        return GamePhase.ROBBER_PLACEMENT;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action) {
        if (!(action instanceof PlaceRobberAction)) throw new IllegalGamePhaseException(currentPhase());
        return Optional.empty(); // always a single step; Game decides what (if anything) comes next
    }
}
