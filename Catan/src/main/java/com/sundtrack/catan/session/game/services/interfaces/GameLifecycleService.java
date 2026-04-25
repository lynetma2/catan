package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.game.Game;

import java.util.UUID;

public interface GameLifecycleService {
    // Game lifecycle
    Game createGame(UUID gameId);
    Game joinGame(UUID gameId, UUID playerId);
    void   abandonGame(UUID gameId);
    Game getGameState(UUID gameId, UUID playerId);
}
