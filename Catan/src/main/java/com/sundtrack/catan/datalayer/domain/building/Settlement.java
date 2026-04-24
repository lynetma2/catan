package com.sundtrack.catan.datalayer.domain.building;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

class Settlement extends AbstractBuilding<Vertex> {
    public Settlement(UUID playerId, Vertex location) {
        super(playerId, location, BuildingKind.SETTLEMENT);
    }
}
