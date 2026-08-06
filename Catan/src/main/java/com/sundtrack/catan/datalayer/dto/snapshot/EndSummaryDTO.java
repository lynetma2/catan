package com.sundtrack.catan.datalayer.dto.snapshot;

import java.util.List;

public record EndSummaryDTO(
        String winnerId,
        List<EndPlayerSummaryDTO> players
) {
}