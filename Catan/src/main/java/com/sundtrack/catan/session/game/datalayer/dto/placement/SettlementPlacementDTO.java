package com.sundtrack.catan.session.game.datalayer.dto.placement;

import com.sundtrack.catan.session.game.datalayer.domain.world.Vertex;

public record SettlementPlacementDTO(Vertex vertex, String playerId) {}
