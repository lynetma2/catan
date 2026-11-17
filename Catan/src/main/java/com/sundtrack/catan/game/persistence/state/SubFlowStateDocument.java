package com.sundtrack.catan.game.persistence.state;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = SubFlowStateDocument.Setup.class, name = "SETUP"),
        @JsonSubTypes.Type(value = SubFlowStateDocument.Discard.class, name = "DISCARD"),
        @JsonSubTypes.Type(value = SubFlowStateDocument.RobberPlacement.class, name = "ROBBER_PLACEMENT"),
        @JsonSubTypes.Type(value = SubFlowStateDocument.RobberSteal.class, name = "ROBBER_STEAL"),
        @JsonSubTypes.Type(value = SubFlowStateDocument.RoadBuilding.class, name = "ROAD_BUILDING")
})
public sealed interface SubFlowStateDocument {
    record Setup(String phase) implements SubFlowStateDocument {}
    record Discard(Map<UUID, Integer> requiredDiscards, Set<UUID> pendingPlayers) implements SubFlowStateDocument {}
    record RobberPlacement() implements SubFlowStateDocument {}
    record RobberSteal(UUID retrievingPlayerId, List<UUID> candidates) implements SubFlowStateDocument {}
    record RoadBuilding(int roadsPlaced, int roadsRequired) implements SubFlowStateDocument {}
}