package com.sundtrack.catan.game.dto.snapshot;

import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.game.domain.developmentCard.DevelopmentCardType;

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