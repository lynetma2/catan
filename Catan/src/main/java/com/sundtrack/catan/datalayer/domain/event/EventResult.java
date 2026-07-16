package com.sundtrack.catan.datalayer.domain.event;

import java.util.*;

// EventResult — bound T to OutboundEvent
public record EventResult<T extends ServerEvent>(
        List<T> broadcast,
        Map<UUID, List<T>> directed
) {
    public static <T extends ServerEvent> EventResult<T> broadcast(T event) {
        return new EventResult<>(List.of(event), Map.of());
    }

    public static <T extends ServerEvent> EventResult<T> broadcast(List<T> events) {
        return new EventResult<>(events, Map.of());
    }

    public static <T extends ServerEvent> EventResult<T> directed(UUID playerId, T event) {
        return new EventResult<>(List.of(), Map.of(playerId, List.of(event)));
    }

    public static <T extends ServerEvent> EventResult<T> directed(UUID playerId, List<T> events) {
        return new EventResult<>(List.of(), Map.of(playerId, events));
    }

    public static <T extends ServerEvent> EventResult<T> directed(Map<UUID, List<T>> events) {
        return new EventResult<>(List.of(), events);
    }

    public static <T extends ServerEvent> EventResult<T> of(
            List<T> broadcast,
            Map<UUID, List<T>> directed
    ) {
        return new EventResult<>(broadcast, directed);
    }

    public static <T extends ServerEvent> EventResult<T> empty() {
        return new EventResult<>(List.of(), Map.of());
    }

    public EventResult<T> merge(EventResult<T> other) {
        List<T> combinedBroadcast = new ArrayList<>(this.broadcast());
        combinedBroadcast.addAll(other.broadcast());

        Map<UUID, List<T>> combinedDirected = new HashMap<>();
        this.directed().forEach((playerId, events) ->
                combinedDirected.put(playerId, new ArrayList<>(events)));
        other.directed().forEach((playerId, events) ->
                combinedDirected.computeIfAbsent(playerId, id -> new ArrayList<>())
                        .addAll(events));

        return EventResult.of(combinedBroadcast, combinedDirected);
    }
}
