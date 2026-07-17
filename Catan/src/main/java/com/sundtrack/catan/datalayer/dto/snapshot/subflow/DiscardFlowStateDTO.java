package com.sundtrack.catan.datalayer.dto.snapshot.subflow;

import java.util.Map;

public record DiscardFlowStateDTO(Map<String, Integer> requiredDiscards) implements FlowStateDTO {
}
