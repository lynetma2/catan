package com.sundtrack.catan.game.domain;

public record PlayerStats(
        long publicVictoryPoints,
        boolean hasLongestRoad,
        int longestRoadLength,
        boolean hasLargestArmy,
        int armySize,
        int devCards,
        int resourceCards
) {
}
