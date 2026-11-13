ALTER TABLE game_history
    ALTER COLUMN started_at  TYPE timestamp(6) with time zone
        USING started_at  AT TIME ZONE 'UTC',
    ALTER COLUMN finished_at TYPE timestamp(6) with time zone
        USING finished_at AT TIME ZONE 'UTC';