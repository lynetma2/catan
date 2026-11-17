package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record PlayerStateDocument(
        UUID playerId,
        String username,
        String color,
        List<DevelopmentCardStateDocument> devCards,
        List<ResourceStateDocument> resources,
        int knightsUsed
) {}

