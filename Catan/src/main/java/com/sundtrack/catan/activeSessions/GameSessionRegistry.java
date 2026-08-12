package com.sundtrack.catan.activeSessions;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameSessionRegistry {

    private final ConcurrentHashMap<String, Binding> bySubscription = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<UUID, Set<String>> subscriptionsByRoom = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Set<String>> subscriptionsBySession = new ConcurrentHashMap<>();

    public void bind(String subscriptionId, String sessionId, UUID playerId, UUID roomId) {
        bySubscription.put(subscriptionId, new Binding(sessionId, playerId, roomId));
        subscriptionsByRoom.computeIfAbsent(roomId, r -> ConcurrentHashMap.newKeySet()).add(subscriptionId);
        subscriptionsBySession.computeIfAbsent(sessionId, s -> ConcurrentHashMap.newKeySet()).add(subscriptionId);
    }

    /**
     * Removes everything for a disconnected socket. Returns the rooms that were affected.
     */
    public Set<UUID> unbindSession(String sessionId) {
        Set<String> subs = subscriptionsBySession.remove(sessionId);
        if (subs == null) return Set.of();

        Set<UUID> affectedRooms = new HashSet<>();
        for (String subId : subs) {
            unbindSubscription(subId).ifPresent(affectedRooms::add);
        }
        return affectedRooms;
    }

    public Optional<UUID> unbindSubscription(String subscriptionId) {
        Binding binding = bySubscription.remove(subscriptionId);
        if (binding == null) return Optional.empty();

        Set<String> room = subscriptionsByRoom.get(binding.roomId());
        if (room != null) {
            room.remove(subscriptionId);
            if (room.isEmpty()) subscriptionsByRoom.remove(binding.roomId());
        }
        Set<String> session = subscriptionsBySession.get(binding.sessionId());
        if (session != null) {
            session.remove(subscriptionId);
            if (session.isEmpty()) subscriptionsBySession.remove(binding.sessionId());
        }
        return Optional.of(binding.roomId());
    }

    public boolean hasConnectedSessions(UUID roomId) {
        Set<String> subs = subscriptionsByRoom.get(roomId);
        return subs != null && !subs.isEmpty();
    }

    private record Binding(String sessionId, UUID playerId, UUID roomId) {
    }
}