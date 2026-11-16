package com.sundtrack.catan.game.application;

import java.security.Principal;
import java.util.UUID;

public record GameContext(
        Principal principal,
        UUID playerId,
        UUID gameId
) {
}
