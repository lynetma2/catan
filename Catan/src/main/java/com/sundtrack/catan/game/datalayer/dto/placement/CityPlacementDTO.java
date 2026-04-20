package com.sundtrack.catan.game.datalayer.dto.placement;

import com.sundtrack.catan.game.datalayer.domain.world.Vertex;

public record CityPlacementDTO(Vertex vertex, String playerId) {}
