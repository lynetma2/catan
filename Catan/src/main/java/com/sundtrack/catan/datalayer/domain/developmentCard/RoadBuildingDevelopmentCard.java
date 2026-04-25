package com.sundtrack.catan.datalayer.domain.developmentCard;

import java.util.UUID;

public class RoadBuildingDevelopmentCard extends AbstractDevelopmentCard {
    public RoadBuildingDevelopmentCard(UUID id, Boolean used) {
        super(id, used, DevelopmentCardType.ROAD_BUILDING);
    }
}
