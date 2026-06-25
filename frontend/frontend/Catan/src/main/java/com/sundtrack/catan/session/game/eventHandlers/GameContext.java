package com.sundtrack.catan.session.game.eventHandlers;

import java.security.Principal;
import java.util.UUID;

public record GameContext(
        Principal principal,
        UUID playerId,
        UUID gameId
) {
}
