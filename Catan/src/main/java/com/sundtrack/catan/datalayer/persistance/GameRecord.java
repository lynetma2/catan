package com.sundtrack.catan.datalayer.persistance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "game_history")
public class GameRecord {

    @Id
    private UUID id;

    private Instant startedAt;
    private Instant finishedAt;

    // Searchable metadata
    private UUID winnerId;
    private int totalTurns;

    // Stores the complex GameSnapshot as a JSON string
    @Column(columnDefinition = "TEXT")
    private String snapshotJson;

    @Column(columnDefinition = "TEXT")
    private String endSummaryJson;

    public GameRecord() {
    } // Required by JPA

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Instant finishedAt) {
        this.finishedAt = finishedAt;
    }

    public UUID getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(UUID winnerId) {
        this.winnerId = winnerId;
    }

    public int getTotalTurns() {
        return totalTurns;
    }

    public void setTotalTurns(int totalTurns) {
        this.totalTurns = totalTurns;
    }

    public String getSnapshotJson() {
        return snapshotJson;
    }

    public void setSnapshotJson(String snapshotJson) {
        this.snapshotJson = snapshotJson;
    }

    public String getEndSummaryJson() {
        return endSummaryJson;
    }

    public void setEndSummaryJson(String endSummaryJson) {
        this.endSummaryJson = endSummaryJson;
    }
}