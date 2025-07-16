package com.sundtrack.catan.game.entity.cards;

public class DevelopmentCard {

    public enum Kind {
        KNIGHT,
        POINT,
        MONOPOLY,
        YEAR_OF_PLENTY,
        ROAD_BUILDING
    }

    private final Kind kind;

    public DevelopmentCard(Kind kind) {
        this.kind = kind;
    }
}
