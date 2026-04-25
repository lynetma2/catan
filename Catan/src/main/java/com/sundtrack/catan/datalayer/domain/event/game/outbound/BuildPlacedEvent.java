package com.sundtrack.catan.datalayer.domain.event.game.outbound;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.BuildingKind;

public record BuildPlacedEvent(
        BuildingKind kind,
        Vertex vertex
) implements OutboundGameEvent {
    @Override
    public OutboundGameEventType type() {
        return OutboundGameEventType.BUILD_PLACED;
    }
}