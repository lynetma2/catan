package com.sundtrack.catan.game.persistence.state;

import java.util.UUID;

public record DevelopmentCardStateDocument(
        UUID id,
        String type,
        int purchasedOnTurn
) {}