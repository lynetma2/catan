package com.sundtrack.catan.datalayer.dto.snapshot.subflow;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = DiscardFlowStateDTO.class, name = "discard"),
        @JsonSubTypes.Type(value = StealFlowStateDTO.class, name = "steal"),
        @JsonSubTypes.Type(value = RoadBuildingFlowStateDTO.class, name = "road_building"),
})
public sealed interface FlowStateDTO
        permits DiscardFlowStateDTO, StealFlowStateDTO, RoadBuildingFlowStateDTO {
}
