package com.sundtrack.catan.game.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.game.application.port.GameStorePort;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.GamePlayer;
import com.sundtrack.catan.game.persistence.state.GameStateDocument;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Comparator;
import java.util.Optional;
import java.util.UUID;

@Component
class GameStoreAdapter implements GameStorePort {
    private final GameRepository repository;
    private final GameStateCodec stateCodec;
    private final GameSnapshotCodec snapshotCodec;
    private final ObjectMapper objectMapper;

    GameStoreAdapter(GameRepository repository, GameStateCodec stateCodec, GameSnapshotCodec snapshotCodec, ObjectMapper objectMapper) {
        this.repository = repository;
        this.stateCodec = stateCodec;
        this.snapshotCodec = snapshotCodec;
        this.objectMapper = objectMapper;
    }

    @Override
    public void save(Game game) {
        GameRow row = repository.findById(game.getId()).orElseGet(() -> {
            GameRow r = new GameRow();
            r.setId(game.getId());
            r.setStatus("ACTIVE");
            r.setStartedAt(Instant.now());
            return r;
        });

        if (game.getCurrentPhase() == GamePhase.GAME_OVER && "ACTIVE".equals(row.getStatus())) {
            row.setStatus("FINISHED");
            row.setFinishedAt(Instant.now());
            row.setWinnerId(winnerOf(game));
            row.setSnapshotJson(write(snapshotCodec.toSnapshot(game)));
            row.setEndSummaryJson(write(snapshotCodec.toEndSummary(game)));
            row.setStateJson(null);
        } else if ("ACTIVE".equals(row.getStatus())) {
            row.setStateJson(write(stateCodec.toDocument(game)));
        }

        row.setTurnNumber(game.getTurnNumber());
        row.setUpdatedAt(Instant.now());
        repository.save(row);
    }

    @Override
    public Optional<Game> findActive(UUID gameId) {
        return repository.findByIdAndStatus(gameId, "ACTIVE")
                .map(r -> stateCodec.toGame(read(r.getStateJson(), GameStateDocument.class)));
    }

    @Override
    public boolean isActive(UUID id) {
        return repository.findByIdAndStatus(id, "ACTIVE").isPresent();
    }

    @Override
    public void markAbandoned(UUID id) {
        repository.findById(id).ifPresent(r -> {
            r.setStatus("ABANDONED");
            repository.save(r);
        });
    }

    @Override
    public long countActive() {
        return repository.countByStatus("ACTIVE");
    }

    private <T> T read(String json, Class<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("deserialize failed", e);
        }
    }

    private UUID winnerOf(Game game) {
        return game.getPlayers().stream()
                .max(Comparator.comparingLong(p -> game.computeTotalVictoryPoints(p.getId())))
                .map(GamePlayer::getId).orElse(null);
    }

    private String write(Object o) {
        try {
            return objectMapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("serialize failed", e);
        }
    }
}