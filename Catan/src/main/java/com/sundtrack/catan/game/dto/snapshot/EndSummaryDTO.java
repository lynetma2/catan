package com.sundtrack.catan.game.dto.snapshot;

import java.util.List;

public record EndSummaryDTO(
        String winnerId,
        List<EndPlayerSummaryDTO> players
) {
}