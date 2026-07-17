package com.sundtrack.catan.datalayer.dto.snapshot.subflow;

public record RoadBuildingFlowStateDTO(int roadsPlaced, int roadsRequired) implements FlowStateDTO {
}
