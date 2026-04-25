package com.sundtrack.catan.datalayer.domain.event;

import java.util.List;
import java.util.Map;
import java.util.UUID;

// EventResult — bound T to OutboundEvent
public record EventResult<T extends OutboundEvent>(
        List<T> broadcast,
        Map<UUID, T> directed
) {
    public static <T extends OutboundEvent> EventResult<T> broadcast(T event) {
        return new EventResult<>(List.of(event), Map.of());
    }

    public static <T extends OutboundEvent> EventResult<T> directed(UUID playerId, T event) {
        return new EventResult<>(List.of(), Map.of(playerId, event));
    }

    public static <T extends OutboundEvent> EventResult<T> of(
            List<T> broadcast,
            Map<UUID, T> directed
    ) {
        return new EventResult<>(broadcast, directed);
    }
}
