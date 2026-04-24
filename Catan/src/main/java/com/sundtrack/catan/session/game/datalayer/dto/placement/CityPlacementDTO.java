package com.sundtrack.catan.session.game.datalayer.dto.placement;

import com.sundtrack.catan.session.game.datalayer.domain.world.Vertex;

public record CityPlacementDTO(Vertex vertex, String playerId) {}
