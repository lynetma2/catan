package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.game.enums.EventType;

@JsonTypeName("EndTurn")
public record EndTurnEventDTO(String playerId) implements GameEvent {
    @Override
    public EventType type() {
        return EventType.EndTurn;
    }
}