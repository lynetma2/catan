package com.sundtrack.catan.datalayer.dto.placement;

import com.sundtrack.catan.datalayer.domain.board.Edge;

public record RoadPlacementDTO(Edge edge, String playerId) {}
