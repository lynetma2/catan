package com.sundtrack.catan.session.game.services;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameStore {
    private final ConcurrentHashMap<UUID, Game> activeGames = new ConcurrentHashMap<>();
    private final GameRepository repository; // JPA repository

    public Game get(UUID id) {
        return activeGames.computeIfAbsent(id, this::loadFromDb);
    }

    public void persist(Game game) {
        repository.save(game.toEntity());
    }

    public void delete(UUID id) {
        activeGames.remove(id); // call when game finishes
    }

    private Game loadFromDb(UUID id) {
        return repository.findById(id)
                .map(Game::fromEntity)
                .orElseThrow(() -> new GameNotFoundException(id));
    }
}
