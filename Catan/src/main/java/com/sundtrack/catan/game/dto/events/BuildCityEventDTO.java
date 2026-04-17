package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.game.dto.world.VertexCoordinatesDTO;
import com.sundtrack.catan.game.enums.EventType;

@JsonTypeName("BuildCity")
public record BuildCityEventDTO(String playerId, VertexCoordinatesDTO vertex) implements GameEvent {
    @Override
    public EventType type() {
        return EventType.BuildCity;
    }
}