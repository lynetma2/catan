package com.sundtrack.catan.datalayer.dto.snapshot;

public record EndPlayerSummaryDTO(
        String id,
        String name,
        String color,
        int victoryPoints,
        boolean hasLongestRoad,
        boolean hasLargestArmy
) {
}