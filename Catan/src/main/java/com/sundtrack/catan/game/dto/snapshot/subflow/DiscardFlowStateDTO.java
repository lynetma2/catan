package com.sundtrack.catan.game.dto.snapshot.subflow;

import java.util.Map;

public record DiscardFlowStateDTO(Map<String, Integer> requiredDiscards) implements FlowStateDTO {
}
