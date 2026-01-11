package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.game.enums.EventType;
import java.util.Map;

@JsonTypeName("TransferResources")
public record TransferResourcesEventDTO(
        String playerId,
        String fromPlayerId,
        String toPlayerId,
        Map<ResourceTypeDTO, Integer> resources,
        Integer count
) implements GameEvent {
    @Override
    public EventType type() {
        return EventType.TransferResources;
    }
}