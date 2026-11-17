package com.sundtrack.catan.game.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.game.application.port.GameQueryPort;
import com.sundtrack.catan.game.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.game.dto.snapshot.GameSnapshotDTO;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
class GameQueryAdapter implements GameQueryPort {
    private final GameRepository repository;
    private final ObjectMapper objectMapper;

    GameQueryAdapter(GameRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Optional<GameSnapshotDTO> findSnapshot(UUID id) {
        return repository.findById(id).filter(r -> "FINISHED".equals(r.getStatus()))
                .map(r -> read(r.getSnapshotJson(), GameSnapshotDTO.class));
    }

    @Override
    public Optional<EndSummaryDTO> findEndSummary(UUID id) {
        return repository.findById(id).filter(r -> "FINISHED".equals(r.getStatus()))
                .map(r -> read(r.getEndSummaryJson(), EndSummaryDTO.class));
    }

    @Override
    public boolean exists(UUID id) {
        return repository.existsById(id);
    }

    @Override
    public long countFinished() {
        return repository.countByStatus("FINISHED");
    }

    private <T> T read(String json, Class<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("deserialize failed", e);
        }
    }

    private String write(Object o) {
        try {
            return objectMapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("serialize failed", e);
        }
    }

}