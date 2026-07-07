package com.sundtrack.catan.datalayer.domain.game.subFlows;

import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.build.PlaceRoadAction;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.IllegalGamePhaseException;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import java.util.Optional;
import java.util.UUID;

public class RoadBuildingFlow implements SubFlow {
    private final int roadsPlaced;

    public RoadBuildingFlow() {
        this(0);
    }

    private RoadBuildingFlow(int roadsPlaced) {
        this.roadsPlaced = roadsPlaced;
    }

    @Override
    public GamePhase currentPhase() {
        return GamePhase.ROAD_BUILDING;
    }

    @Override
    public Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId) {
        if (!(action instanceof PlaceRoadAction)) throw new IllegalGamePhaseException(currentPhase());
        int placed = roadsPlaced + 1;
        return placed >= 2 ? Optional.empty() : Optional.of(new RoadBuildingFlow(placed));
    }

    @Override
    public boolean isFreePlacement(PieceType pieceType) {
        return pieceType == PieceType.ROAD;
    }
}
