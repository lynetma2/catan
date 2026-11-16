package com.sundtrack.catan.game.dto.placement;

import com.sundtrack.catan.game.domain.board.Vertex;

public record SettlementPlacementDTO(Vertex vertex, String playerId) {
}
