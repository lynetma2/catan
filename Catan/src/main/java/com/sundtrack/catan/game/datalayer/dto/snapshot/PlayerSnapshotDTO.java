package com.sundtrack.catan.game.datalayer.dto.snapshot;

import com.sundtrack.catan.game.datalayer.domain.Resource;

import java.util.List;

/**
 * A professional snapshot representing a player's state.
 * Using List.copyOf in the constructor ensures the snapshot is truly immutable.
 */
public record PlayerSnapshotDTO(
        String id,
        String name,
        String color,
        List<Resource> resources,
        List<DevCardSnapshotDTO> devCards,
        int victoryPoints,
        int cardCount,
        int devCardCount,
        boolean hasLongestRoad,
        boolean hasLargestArmy,
        int usedRobbers
) {
    public PlayerSnapshotDTO {
        // Defensive copies to ensure immutability
        resources = List.copyOf(resources);
        devCards = List.copyOf(devCards);
    }
}
