package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.devCard.DevCardType;

public record DevCardSnapshotDTO(
        String uid,
        DevCardType type,
        boolean isPlayed,
        boolean boughtThisTurn
) {}