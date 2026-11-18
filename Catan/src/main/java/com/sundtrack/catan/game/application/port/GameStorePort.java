package com.sundtrack.catan.game.application.port;

import com.sundtrack.catan.game.domain.Game;

import java.util.Optional;
import java.util.UUID;

public interface GameStorePort {
    void save(Game game);                    // insert or update; auto-finishes on GAME_OVER
    Optional<Game> findActive(UUID gameId);  // ACTIVE only
    boolean isActive(UUID gameId);
    void markAbandoned(UUID gameId);
    long countActive();
}
