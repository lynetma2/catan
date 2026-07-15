package com.sundtrack.catan.datalayer.domain.game;

public record PlayerStats(
        long publicVictoryPoints,
        boolean hasLongestRoad,
        int longestRoadLength,
        boolean hasLargestArmy,
        int armySize
) {}
