package com.sundtrack.catan.game.persistence;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("game")
class GameRow {
    @Id
    @Column("id")
    private UUID id;

    @Column("status")
    private String status;

    @Version
    @Column("version")
    private Long version;   // null = new -> INSERT; set -> UPDATE

    @Column("started_at")
    private Instant startedAt;

    @Column("finished_at")
    private Instant finishedAt;

    @Column("winner_id")
    private UUID winnerId;

    @Column("turn_number")
    private int turnNumber;

    @Column("state_json")
    private String stateJson;

    @Column("snapshot_json")
    private String snapshotJson;

    @Column("end_summary_json")
    private String endSummaryJson;

    @Column("updated_at")
    private Instant updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
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

    public int getTurnNumber() {
        return turnNumber;
    }

    public void setTurnNumber(int turnNumber) {
        this.turnNumber = turnNumber;
    }

    public String getStateJson() {
        return stateJson;
    }

    public void setStateJson(String stateJson) {
        this.stateJson = stateJson;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}