package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class AbstractDevelopmentCard implements DevelopmentCard {
    private final UUID id;
    private final Boolean used;
    private final DevelopmentCardType type;

    public AbstractDevelopmentCard(UUID id, Boolean used, DevelopmentCardType type) {
        this.id = id;
        this.used = used;
        this.type = type;
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
}
