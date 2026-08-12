package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.game.Game;

import java.util.Optional;
import java.util.UUID;

public interface ActiveGameRegistry {

    void register(Game game);

    Game getActive(UUID gameId);

    Optional<Game> findActive(UUID gameId);

    boolean isActive(UUID gameId);

    void unregister(UUID gameId);

    int getActiveGameCount();
}