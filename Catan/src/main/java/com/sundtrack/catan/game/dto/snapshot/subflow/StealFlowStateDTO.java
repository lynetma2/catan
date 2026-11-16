package com.sundtrack.catan.game.dto.snapshot.subflow;

import java.util.List;

public record StealFlowStateDTO (String retrievingPlayerId, List<String> candidates) implements FlowStateDTO {
}
