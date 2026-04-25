package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class AbstractDevelopmentCard implements DevelopmentCard {
    private final UUID id;
    private final Boolean used;
    private final DevelopmentCardType type;
    private final Boolean isBoughtThisTurn;

    public AbstractDevelopmentCard(UUID id, Boolean used, DevelopmentCardType type, Boolean isBoughtThisTurn) {
        this.id = id;
        this.used = used;
        this.type = type;
        this.isBoughtThisTurn = isBoughtThisTurn;
    }

    public UUID getId() {
        return id;
    }

    public Boolean isUsed() {
        return used;
    }

    public DevelopmentCardType getType() {
        return type;
    }

    public Boolean isBoughtThisTurn() {
        return isBoughtThisTurn;
    }
}
