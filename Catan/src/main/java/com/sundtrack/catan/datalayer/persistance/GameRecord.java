package com.sundtrack.catan.datalayer.persistance;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "game_history")
public class GameRecord {

    @Id
    private UUID id;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    // Searchable metadata
    private UUID winnerId;
    private int totalTurns;

    // Stores the complex GameSnapshot as a JSON string
    @Lob // Forces Hibernate to treat this as a large text object
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
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