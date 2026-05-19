package com.sundtrack.catan.datalayer.domain.event;

import java.util.List;
import java.util.Map;
import java.util.UUID;

// EventResult — bound T to OutboundEvent
public record EventResult<T extends ServerEvent>(
        List<T> broadcast,
        Map<UUID, T> directed
) {
    public static <T extends ServerEvent> EventResult<T> broadcast(T event) {
        return new EventResult<>(List.of(event), Map.of());
    }

    public static <T extends ServerEvent> EventResult<T> directed(UUID playerId, T event) {
        return new EventResult<>(List.of(), Map.of(playerId, event));
    }

    public static <T extends ServerEvent> EventResult<T> of(
            List<T> broadcast,
            Map<UUID, T> directed
    ) {
        return new EventResult<>(broadcast, directed);
    }

    public static <T extends ServerEvent> EventResult<T> empty() {
        return new EventResult<>(List.of(), Map.of());
    }
}
