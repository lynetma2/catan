package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryActiveGameRegistry implements ActiveGameRegistry {

    private final ConcurrentHashMap<UUID, Game> activeGames = new ConcurrentHashMap<>();

    @Override
    public void register(Game game) {
        Game existing = activeGames.putIfAbsent(game.getId(), game);

        if (existing != null) {
            throw new IllegalStateException(
                    "Attempted to register an already active game: " + game.getId()
            );
        }
    }

    @Override
    public Game getActive(UUID gameId) {
        return findActive(gameId)
                .orElseThrow(() ->
                        new IllegalStateException("No active game with id: " + gameId)
                );
    }

    @Override
    public Optional<Game> findActive(UUID gameId) {
        return Optional.ofNullable(activeGames.get(gameId));
    }

    @Override
    public boolean isActive(UUID gameId) {
        return activeGames.containsKey(gameId);
    }

    @Override
    public void unregister(UUID gameId) {
        activeGames.remove(gameId);
    }

    @Override
    public int getActiveGameCount() {
        return activeGames.size();
    }
}