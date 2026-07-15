package com.sundtrack.catan.datalayer.domain.game;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class GameAwards {
    private UUID longestRoadHolder;
    private UUID largestArmyHolder;
    private final GameConfiguration gameConfiguration;

    public GameAwards(GameConfiguration gameConfiguration) {
        this.gameConfiguration = gameConfiguration;
    }

    public Optional<UUID> getLongestRoadHolder() {
        return Optional.ofNullable(longestRoadHolder);
    }

    public Optional<UUID> getLargestArmyHolder() {
        return Optional.ofNullable(largestArmyHolder);
    }

    public boolean hasLongestRoad(UUID playerId) {
        return playerId.equals(longestRoadHolder);
    }

    public boolean hasLargestArmy(UUID playerId) {
        return playerId.equals(largestArmyHolder);
    }

    /** lengths: every player's current longest-road length. */
    public void refreshLongestRoad(Map<UUID, Integer> lengths) {
        longestRoadHolder = refreshHolder(longestRoadHolder, lengths, gameConfiguration.getMinRoadLength());
    }

    /** armySizes: every player's current knightsUsed count. */
    public void refreshLargestArmy(Map<UUID, Integer> armySizes) {
        largestArmyHolder = refreshHolder(largestArmyHolder, armySizes, gameConfiguration.getMinArmySize());
    }

    private UUID refreshHolder(UUID currentHolder, Map<UUID, Integer> values, int minThreshold) {
        int currentValue = currentHolder == null ? 0 : values.getOrDefault(currentHolder, 0);

        for (var entry : values.entrySet()) {
            if (entry.getKey().equals(currentHolder)) continue;
            if (entry.getValue() >= minThreshold && entry.getValue() > currentValue) {
                return entry.getKey(); // strictly exceeds — new holder, ties don't flip
            }
        }
        return currentHolder; // nobody dethroned them
    }
}