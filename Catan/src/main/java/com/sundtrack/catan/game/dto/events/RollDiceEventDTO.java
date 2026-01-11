package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.game.enums.EventType;

@JsonTypeName("RollDice")
public record RollDiceEventDTO(String playerId) implements GameEvent {
    @Override
    public EventType type() {
        return EventType.RollDice;
    }
}