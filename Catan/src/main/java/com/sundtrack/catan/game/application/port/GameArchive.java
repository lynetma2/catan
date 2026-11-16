package com.sundtrack.catan.game.application.port;

import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.game.dto.snapshot.GameSnapshotDTO;

import java.util.Optional;
import java.util.UUID;

public interface GameArchive {

    void archive(Game game);

    Optional<GameSnapshotDTO> findSnapshot(UUID gameId);

    Optional<EndSummaryDTO> findEndSummary(UUID gameId);

    boolean exists(UUID gameId);

    long getArchivedGameCount();
}