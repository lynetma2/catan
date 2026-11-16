package com.sundtrack.catan.game.domain.subFlows;

import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.game.domain.GamePhase;

import java.util.Optional;
import java.util.UUID;

public interface SubFlow {
    GamePhase currentPhase();

    /**
     * Returns the next state of this flow, or empty if it just completed.
     */
    Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId);

    default boolean isFreePlacement(PieceType pieceType) {
        return false;
    }
}
