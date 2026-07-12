package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;

public record DevCardSnapshotDTO(
        String uid,
        DevelopmentCardType type,
        boolean boughtThisTurn
) {
}