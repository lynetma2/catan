CREATE TABLE game (
    id               uuid PRIMARY KEY,
    status           varchar(20) NOT NULL,
    version          bigint,
    started_at       timestamptz,
    finished_at      timestamptz,
    winner_id        uuid,
    turn_number      integer NOT NULL DEFAULT 0,
    state_json       text,
    snapshot_json    text,
    end_summary_json text,
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_status ON game(status);
CREATE INDEX idx_game_finished_at ON game(finished_at);

INSERT INTO game (id, status, started_at, finished_at, winner_id, turn_number,
                  snapshot_json, end_summary_json, version, updated_at)
SELECT id, 'FINISHED', started_at, finished_at, winner_id, total_turns,
       snapshot_json, end_summary_json, 0, now()
FROM game_history;