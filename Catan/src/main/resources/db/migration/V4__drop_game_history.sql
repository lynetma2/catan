-- The game_history table was migrated into the unified game table in V3.
-- Drop it now that the new persistence path is verified working.
DROP TABLE IF EXISTS game_history;