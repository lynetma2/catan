package com.sundtrack.catan.game.persistence.state;

public record DicePairStateDocument(
        long seed,
        int rollCount,
        int[] lastRoll
) {}