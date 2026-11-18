package com.sundtrack.catan.game.persistence.state;

import java.util.UUID;

public record GameAwardsDocument(
        UUID longestRoadHolder,
        UUID largestArmyHolder
) {}