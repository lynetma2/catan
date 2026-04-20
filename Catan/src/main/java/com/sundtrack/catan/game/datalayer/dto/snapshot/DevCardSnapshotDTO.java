package com.sundtrack.catan.game.datalayer.dto.snapshot;

import com.sundtrack.catan.game.datalayer.domain.DevCardType;

public record DevCardSnapshotDTO(
        String uid,
        DevCardType type,
        boolean isPlayed,
        boolean boughtThisTurn
) {}