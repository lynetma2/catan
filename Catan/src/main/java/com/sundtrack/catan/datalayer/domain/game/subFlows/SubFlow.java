package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.Optional;

public interface SubFlow {
    GamePhase currentPhase();

    /**
     * Returns the next state of this flow, or empty if it just completed.
     */
    Optional<SubFlow> handle(ClientAction action);
}
