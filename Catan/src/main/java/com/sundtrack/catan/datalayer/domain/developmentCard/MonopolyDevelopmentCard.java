package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class MonopolyDevelopmentCard extends AbstractDevelopmentCard{
    public MonopolyDevelopmentCard(UUID id, Boolean used, Boolean isBoughtThisTurn) {
        super(id, used, DevelopmentCardType.MONOPOLY,  isBoughtThisTurn);
    }
}
