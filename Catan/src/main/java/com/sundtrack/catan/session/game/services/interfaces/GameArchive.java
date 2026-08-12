package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

import java.util.Optional;
import java.util.UUID;

public interface GameArchive {

    void archive(Game game);

    Optional<GameSnapshotDTO> findSnapshot(UUID gameId);

    Optional<EndSummaryDTO> findEndSummary(UUID gameId);

    boolean exists(UUID gameId);
}