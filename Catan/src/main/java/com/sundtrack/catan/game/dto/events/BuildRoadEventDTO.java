package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.game.dto.world.EdgeCoordinatesDTO;
import com.sundtrack.catan.game.enums.EventType;

@JsonTypeName("BuildRoad")
public record BuildRoadEventDTO(String playerId, EdgeCoordinatesDTO edge) implements GameEvent {
    @Override
    public EventType type() {
        return EventType.BuildRoad;
    }
}
