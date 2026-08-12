package com.sundtrack.catan.session.game.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.datalayer.dao.GameHistoryRepository;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.datalayer.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.datalayer.persistance.GameRecord;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class JpaGameArchive implements GameArchive {

    private final GameHistoryRepository repository;
    private final ObjectMapper objectMapper;
    private final GameMapper gameMapper;

    public JpaGameArchive(
            GameHistoryRepository repository,
            ObjectMapper objectMapper,
            GameMapper gameMapper
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.gameMapper = gameMapper;
    }

    @Override
    @Transactional
    public void archive(Game game) {
        try {
            GameSnapshotDTO snapshot = gameMapper.toFullSnapshotDTO(game);
            EndSummaryDTO endSummaryDTO = gameMapper.toEndSummaryDTO(game);

            GameRecord record = repository.findById(game.getId())
                    .orElseGet(() -> {
                        GameRecord newRecord = new GameRecord();
                        newRecord.setId(game.getId());
                        newRecord.setStartedAt(LocalDateTime.now());
                        return newRecord;
                    });

            record.setFinishedAt(LocalDateTime.now());
            record.setTotalTurns(game.getTurnNumber());
            record.setSnapshotJson(objectMapper.writeValueAsString(snapshot));
            record.setEndSummaryJson(objectMapper.writeValueAsString(endSummaryDTO));

            repository.save(record);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Failed to serialize game snapshot for game: " + game.getId(),
                    e
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GameSnapshotDTO> findSnapshot(UUID gameId) {
        return repository.findById(gameId)
                .map(record -> deserialize(record.getSnapshotJson(), gameId, GameSnapshotDTO.class));
    }

    private <T> T deserialize(String json, UUID gameId, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Failed to deserialize game snapshot for game: " + gameId,
                    e
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EndSummaryDTO> findEndSummary(UUID gameId) {
        return repository.findById(gameId)
                .map(record -> deserialize(record.getEndSummaryJson(), gameId, EndSummaryDTO.class));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exists(UUID gameId) {
        return repository.existsById(gameId);
    }
}