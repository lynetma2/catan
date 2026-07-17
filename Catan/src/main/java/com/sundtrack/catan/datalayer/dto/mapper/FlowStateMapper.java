package com.sundtrack.catan.datalayer.dto.mapper;

import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.snapshot.subflow.DiscardFlowStateDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.subflow.FlowStateDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.subflow.RoadBuildingFlowStateDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.subflow.StealFlowStateDTO;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class FlowStateMapper {
    private FlowStateMapper() {}

    public static FlowStateDTO toDTO(Game game) {
        return switch (game.getCurrentPhase()) {
            case DISCARD -> toDiscardDTO(game);
            case ROBBER_STEAL -> toStealDTO(game);
            case ROAD_BUILDING -> toRoadBuildingDTO(game);
            default -> null;
        };
    }

    private static FlowStateDTO toDiscardDTO(Game game) {
        Map<String, Integer> required = new HashMap<>();
        game.getRequiredDiscards().forEach((playerId, amount) -> required.put(playerId.toString(), amount));
        return new DiscardFlowStateDTO(required);
    }

    private static FlowStateDTO toStealDTO(Game game) {
        UUID retrievingPlayerId = game.getRetrievingPlayerId()
                .orElseThrow(() -> new IllegalStateException(
                        "Phase is ROBBER_STEAL but no active RobberStealFlow was found"));

        return new StealFlowStateDTO(
                retrievingPlayerId.toString(),
                game.getStealCandidates().stream().map(UUID::toString).toList());
    }

    private static FlowStateDTO toRoadBuildingDTO(Game game) {
        return new RoadBuildingFlowStateDTO(game.getRoadsPlaced(), game.getRoadsRequired());
    }
}
