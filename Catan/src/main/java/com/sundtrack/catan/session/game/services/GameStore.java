package com.sundtrack.catan.session.game.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.datalayer.dao.GameHistoryRepository;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.datalayer.persistance.GameRecord;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
     * Saves the complete state of the game to SQLite.
     */
    @Transactional
    public void persist(Game game) {
        try {
            // 1. Get the FULL snapshot (including hidden cards/resources of all players)
            GameSnapshotDTO fullSnapshot = gameMapper.toFullSnapshotDTO(game);

            // 2. Fetch existing record or create new
            GameRecord record = repository.findById(game.getId()).orElse(new GameRecord());
            record.setId(game.getId());
            record.setFinishedAt(LocalDateTime.now());
            record.setTotalTurns(game.getTurnNumber());

            // Optional: If the game is over, calculate and save the winner ID here
            // record.setWinnerId(determineWinnerId(game));

            // 3. Serialize the DTO to a JSON string
            record.setSnapshotJson(jacksonObjectMapper.writeValueAsString(fullSnapshot));

            // 4. Save to SQLite
            repository.save(record);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize game state for persistence", e);
        }
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