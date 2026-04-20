package com.sundtrack.catan.game.datalayer.dto.placement;

import com.sundtrack.catan.game.datalayer.domain.world.Vertex;

public record SettlementPlacementDTO(Vertex vertex, String playerId) {}
