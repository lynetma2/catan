package com.sundtrack.catan.datalayer.domain.event.game.server;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.BuildingKind;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

public record BuildPlacedEvent(
        BuildingKind kind,
        Vertex vertex
) implements GameServerEvent {

    @Override
    public String event() {
        return "placed";
    }
}