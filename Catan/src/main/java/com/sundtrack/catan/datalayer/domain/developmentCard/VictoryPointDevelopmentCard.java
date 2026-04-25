package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class VictoryPointDevelopmentCard extends AbstractDevelopmentCard{
    public VictoryPointDevelopmentCard(UUID id, Boolean used, Boolean isBoughtThisTurn) {
        super(id, used, DevelopmentCardType.VICTORY_POINT, isBoughtThisTurn);
    }
}
