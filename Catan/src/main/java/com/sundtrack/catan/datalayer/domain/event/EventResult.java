package com.sundtrack.catan.datalayer.domain.event;

import com.sundtrack.catan.datalayer.domain.event.outbound.OutboundGameEvent;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record EventResult(
        List<OutboundGameEvent> broadcast,
        Map<UUID, OutboundGameEvent> directed
) {
    // Broadcast one event to all players
    public static EventResult broadcast(OutboundGameEvent event) {
        return new EventResult(List.of(event), Map.of());
    }

    // Send one event to one player only
    public static EventResult directed(UUID playerId, OutboundGameEvent event) {
        return new EventResult(List.of(), Map.of(playerId, event));
    }

    // Both at the same time
    public static EventResult of(
            List<OutboundGameEvent> broadcast,
            Map<UUID, OutboundGameEvent> directed
    ) {
        return new EventResult(broadcast, directed);
    }
}
