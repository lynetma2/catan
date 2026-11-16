package com.sundtrack.catan.game.dto.snapshot;

public record EndPlayerSummaryDTO(
        String id,
        String name,
        String color,
        int victoryPoints,
        boolean hasLongestRoad,
        boolean hasLargestArmy
) {
}