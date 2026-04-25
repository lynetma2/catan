package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class YearOfPlentyDevelopmentCard extends AbstractDevelopmentCard {
    public YearOfPlentyDevelopmentCard(UUID id, Boolean used) {
        super(id, used, DevelopmentCardType.YEAR_OF_PLENTY);
    }
}
