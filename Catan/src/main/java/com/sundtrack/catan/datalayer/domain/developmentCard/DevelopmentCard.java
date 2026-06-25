package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public interface DevelopmentCard {
    UUID getId();
    DevelopmentCardType getType();
    Boolean isUsed();
    Boolean isBoughtThisTurn();
}
