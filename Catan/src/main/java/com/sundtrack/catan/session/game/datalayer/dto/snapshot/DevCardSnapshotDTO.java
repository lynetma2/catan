package com.sundtrack.catan.session.game.datalayer.dto.snapshot;

import com.sundtrack.catan.session.game.datalayer.domain.DevCardType;

public record DevCardSnapshotDTO(
        String uid,
        DevCardType type,
        boolean isPlayed,
        boolean boughtThisTurn
) {}