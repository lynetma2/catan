package com.sundtrack.catan.datalayer.dao;

import com.sundtrack.catan.datalayer.persistance.GameRecord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class GameRecordPersistenceTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired
    GameHistoryRepository repository;

    @Test
    void largeJsonSnapshotSurvivesARoundTrip() {
        UUID id = UUID.randomUUID();
        String bigJson = "{\"blob\":\"" + "x".repeat(50_000) + "\"}";

        GameRecord record = new GameRecord();
        record.setId(id);
        record.setStartedAt(LocalDateTime.now());
        record.setFinishedAt(LocalDateTime.now());
        record.setTotalTurns(42);
        record.setSnapshotJson(bigJson);
        record.setEndSummaryJson("{\"winner\":\"red\"}");

        repository.save(record);

        GameRecord loaded = repository.findById(id).orElseThrow();

        assertThat(loaded.getSnapshotJson()).isEqualTo(bigJson);
        assertThat(loaded.getSnapshotJson().length()).isGreaterThan(50_000);
        assertThat(loaded.getEndSummaryJson()).isEqualTo("{\"winner\":\"red\"}");
        assertThat(loaded.getTotalTurns()).isEqualTo(42);
        assertThat(loaded.getId()).isEqualTo(id);
    }
}