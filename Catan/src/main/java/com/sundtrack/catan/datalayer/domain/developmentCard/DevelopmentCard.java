package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class DevelopmentCard {

    private final UUID id;
    private final DevelopmentCardType type;
    private final int purchasedOnTurn;

    public DevelopmentCard(UUID id, DevelopmentCardType type, int purchasedOnTurn) {
        this.id = id;
        this.type = type;
        this.purchasedOnTurn = purchasedOnTurn;
    }

    public UUID getId() {
        return id;
    }

    public DevelopmentCardType getType() {
        return type;
    }

    public boolean isBoughtThisTurn(int currentTurn) {
        return purchasedOnTurn == currentTurn;
    }

    public boolean isPlayable(int currentTurn) {
        return purchasedOnTurn < currentTurn;
    }
}