package com.sundtrack.catan.lobby.application;

import java.security.Principal;
import java.util.UUID;

public record LobbyContext(
        Principal principal,
        UUID playerId,
        UUID lobbyId
) {
}
