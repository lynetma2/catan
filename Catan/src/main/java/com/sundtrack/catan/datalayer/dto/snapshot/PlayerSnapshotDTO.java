package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;

/**
 * A professional snapshot representing a player's state.
 * Using List.copyOf in the constructor ensures the snapshot is truly immutable.
 */
public record PlayerSnapshotDTO(
        String id,
        String name,
        String color,
        List<Resource> resources, // empty for other players — see resCardCount for their total
        List<DevCardSnapshotDTO> devCards, // empty for other players — see devCardCount for their total
        long victoryPoints,
        int resCardCount,
        int devCardCount,
        boolean hasLongestRoad,
        boolean hasLargestArmy,
        int knightsUsed
) {
    public PlayerSnapshotDTO {
        // Defensive copies to ensure immutability
        resources = List.copyOf(resources);
        devCards = List.copyOf(devCards);
    }
}
