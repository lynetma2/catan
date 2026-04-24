package com.sundtrack.catan.session.game.datalayer.dto.placement;

import com.sundtrack.catan.session.game.datalayer.domain.world.Edge;

public record RoadPlacementDTO(Edge edge, String playerId) {}
