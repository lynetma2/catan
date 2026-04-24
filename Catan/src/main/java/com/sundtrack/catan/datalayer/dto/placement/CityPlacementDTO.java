package com.sundtrack.catan.datalayer.dto.placement;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

public record CityPlacementDTO(Vertex vertex, String playerId) {}
