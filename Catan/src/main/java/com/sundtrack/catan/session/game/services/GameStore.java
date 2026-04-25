package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.game.Game;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameStore {
    private final ConcurrentHashMap<UUID, Game> activeGames = new ConcurrentHashMap<>();
    //private final GameRepository repository; // JPA repository

//    public Game get(UUID id) {
//        return activeGames.computeIfAbsent(id, this::loadFromDb);
//    }

    public Game get(UUID gameId) {
        return activeGames.get(gameId);
    }

    public void add(UUID gameId, Game game) {
        activeGames.put(gameId, game);
    }

    public void delete(UUID id) {
        activeGames.remove(id);
    }

    public void persist(Game game) {
        // Implementation will come later on, when db structure has been decided.
    }

//    private Game loadFromDb(UUID id) {
//        return repository.findById(id)
//                .map(Game::fromEntity)
//                .orElseThrow(() -> new GameNotFoundException(id));
//    }
}
