package com.sundtrack.catan.game.persistence;

import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.dto.mapper.GameMapper;
import com.sundtrack.catan.game.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.game.dto.snapshot.GameSnapshotDTO;
import org.springframework.stereotype.Component;

@Component
class GameSnapshotCodec {

    private final GameMapper gameMapper;

    public GameSnapshotCodec(GameMapper gameMapper) {
        this.gameMapper = gameMapper;
    }

    public GameSnapshotDTO toSnapshot(Game game) {
        return gameMapper.toFullSnapshotDTO(game);
    }

    public EndSummaryDTO toEndSummary(Game game) {
        return gameMapper.toEndSummaryDTO(game);
    }
}