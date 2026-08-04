package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;

public record DevCardSnapshotDTO(
        String uid,
        DevelopmentCardType type,
        int purchasedOnTurn
) {

    public DevCardSnapshotDTO(DevelopmentCard card) {
        this(
                card.getId().toString(),
                card.getType(),
                card.getPurchasedOnTurn()
        );
    }
}