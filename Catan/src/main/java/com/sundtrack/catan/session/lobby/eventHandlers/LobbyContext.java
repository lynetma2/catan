package com.sundtrack.catan.session.lobby.eventHandlers;

import java.security.Principal;
import java.util.UUID;

public record LobbyContext(
        Principal principal,
        UUID playerId,
        UUID lobbyId
) {
}
