package com.sundtrack.catan.datalayer.domain.building;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

class City extends AbstractBuilding<Vertex> {
    public City(UUID playerId, Vertex location) {
        super(playerId, location, BuildingKind.CITY);
    }
}