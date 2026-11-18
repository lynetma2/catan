package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.UUID;

public record TurnOrderDocument(
        List<UUID> playerIds,
        int currentIndex,
        boolean reversed
) {}