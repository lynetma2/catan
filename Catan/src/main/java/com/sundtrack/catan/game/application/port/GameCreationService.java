package com.sundtrack.catan.game.application.port;

import com.sundtrack.catan.game.domain.Game;

import java.util.UUID;

public interface GameCreationService {
    // Game lifecycle
    Game createGame(UUID id);
}
