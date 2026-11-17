package com.sundtrack.catan.game.persistence;

import org.springframework.data.annotation.Id;
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
    private String status;              // "ACTIVE" or "FINISHED"

    @Column("version")
    private long version;               // optimistic locking

    @Column("started_at")
    private Instant startedAt;

    @Column("finished_at")
    private Instant finishedAt;

    @Column("winner_id")
    private UUID winnerId;

    @Column("turn_number")
    private int turnNumber;

    @Column("state_json")
    private String stateJson;           // lossless state, only while ACTIVE

    @Column("snapshot_json")
    private String snapshotJson;        // client snapshot, once FINISHED

    @Column("end_summary_json")
    private String endSummaryJson;      // end summary, once FINISHED

    @Column("updated_at")
    private Instant updatedAt;

    // getters + setters
}