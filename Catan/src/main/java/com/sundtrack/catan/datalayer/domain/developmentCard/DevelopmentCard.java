package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class DevelopmentCard {

    private final UUID id;
    private final DevelopmentCardType type;
    private boolean isBoughtThisTurn;

    public DevelopmentCard(UUID id, DevelopmentCardType type) {
        this.id = id;
        this.type = type;
        this.isBoughtThisTurn = true;
    }

    public UUID getId() {
        return id;
    }

    public DevelopmentCardType getType() {
        return type;
    }

    public boolean isBoughtThisTurn() {
        return isBoughtThisTurn;
    }
}