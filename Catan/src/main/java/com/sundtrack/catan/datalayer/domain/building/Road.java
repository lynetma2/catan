package com.sundtrack.catan.datalayer.domain.building;

import com.sundtrack.catan.datalayer.domain.board.Edge;

import java.util.UUID;

class Road extends AbstractBuilding<Edge> {
    public Road(UUID playerId, Edge location) {
        super(playerId, location, BuildingKind.ROAD);
    }
}
