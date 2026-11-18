package com.sundtrack.catan.game.domain.subFlows;

import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.game.domain.event.action.build.PlaceRoadAction;
import com.sundtrack.catan.game.domain.GamePhase;

import java.util.Optional;
import java.util.UUID;

public class RoadBuildingFlow implements SubFlow {
    private final int roadsRequired;
    private final int roadsPlaced;

    public RoadBuildingFlow(int roadsRequired) {
        this(0, roadsRequired);
    }

    private RoadBuildingFlow(int roadsPlaced, int roadsRequired) {
        this.roadsPlaced = roadsPlaced;
        this.roadsRequired = roadsRequired;
    }

    public static RoadBuildingFlow restore(int roadsPlaced, int roadsRequired) {
        return new RoadBuildingFlow(roadsPlaced, roadsRequired);
    }

    @Override public GamePhase currentPhase() { return GamePhase.ROAD_BUILDING; }

    @Override
    public Optional<SubFlow> handle(ClientAction action, UUID actingPlayerId) {
        if (!(action instanceof PlaceRoadAction)) {
            throw new IllegalStateException(
                    "RoadBuildingFlow.handle called with " + action.getClass().getSimpleName());
        }
        int placed = roadsPlaced + 1;
        return placed >= roadsRequired ? Optional.empty() : Optional.of(new RoadBuildingFlow(placed));
    }

    @Override
    public boolean isFreePlacement(PieceType pieceType) {
        return pieceType == PieceType.ROAD;
    }

    public int getRoadsPlaced() { return roadsPlaced; }
    public int getRoadsRequired() { return roadsRequired; }
}
