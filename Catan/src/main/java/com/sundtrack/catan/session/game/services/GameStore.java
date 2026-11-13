package com.sundtrack.catan.session.game.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.datalayer.dao.GameHistoryRepository;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameStore {
    private final ConcurrentHashMap<UUID, Game> activeGames = new ConcurrentHashMap<>();

    private final GameHistoryRepository repository;
    private final ObjectMapper jacksonObjectMapper; // Spring's JSON serializer
    private final GameMapper gameMapper;           // Your custom domain-to-DTO mapper

    public GameStore(GameHistoryRepository repository, ObjectMapper jacksonObjectMapper, GameMapper gameMapper) {
        this.repository = repository;
        this.jacksonObjectMapper = jacksonObjectMapper;
        this.gameMapper = gameMapper;
    }

    public Game get(UUID gameId) {
        // Active games are kept in memory.
        // If it's missing, it's either finished or doesn't exist.
        return activeGames.get(gameId);
    }

    public void add(UUID gameId, Game game) {
        activeGames.put(gameId, game);
    }

    public void delete(UUID id) {
        activeGames.remove(id);
    }

    /**
     * Loads a historical/finished game from SQLite directly as a DTO.
     * This is perfect for showing the EndScreen or a Replay view without
     * needing to rebuild the complex mutable Game domain object.
     */
    public GameSnapshotDTO loadSnapshotFromDb(UUID gameId) {
        return repository.findById(gameId)
                .map(record -> {
                    try {
                        return jacksonObjectMapper.readValue(record.getSnapshotJson(), GameSnapshotDTO.class);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException("Failed to deserialize game snapshot", e);
                    }
                })
                .orElseThrow(() -> new RuntimeException("Game not found in DB: " + gameId));
    }
}