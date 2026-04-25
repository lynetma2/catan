package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class KnightDevelopmentCard extends AbstractDevelopmentCard {
    public KnightDevelopmentCard(UUID id, Boolean used, Boolean isBoughtThisTurn) {
        super(id, used, DevelopmentCardType.KNIGHT, isBoughtThisTurn);
    }
}
