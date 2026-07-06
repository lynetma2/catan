package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceSettlementAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.game.TurnOrder;

import java.util.Optional;

public class SetupFlow implements SubFlow {
    private final TurnOrder turnOrder;
    private final GamePhase phase;

    private SetupFlow(TurnOrder turnOrder, GamePhase phase) {
        this.turnOrder = turnOrder;
        this.phase = phase;
    }

    public static SetupFlow start(TurnOrder turnOrder) {
        return new SetupFlow(turnOrder, GamePhase.SETUP_PLACE_SETTLEMENT);
    }

    @Override
    public GamePhase currentPhase() {
        return phase;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action) {
        if (phase == GamePhase.SETUP_PLACE_SETTLEMENT) {
            if (!(action instanceof PlaceSettlementAction)) throw new IllegalGamePhaseException(phase);
            return Optional.of(new SetupFlow(turnOrder, GamePhase.SETUP_PLACE_ROAD));
        }
        if (!(action instanceof PlaceRoadAction)) throw new IllegalGamePhaseException(phase);
        TurnOrder.SetupAdvanceResult result = turnOrder.advanceSetup();
        return switch (result) {
            case SETUP_COMPLETE -> Optional.empty();
            case SAME_PLAYER_AGAIN, NEXT_PLAYER ->
                    Optional.of(new SetupFlow(turnOrder, GamePhase.SETUP_PLACE_SETTLEMENT));
        };
    }
}
