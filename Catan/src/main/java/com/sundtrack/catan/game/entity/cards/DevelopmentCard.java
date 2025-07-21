package com.sundtrack.catan.game.entity.cards;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

    public static List<DevelopmentCard> generateDeck() {
        List<DevelopmentCard> developmentCards = new ArrayList<>();
        //Add the knight cards
        for (int i = 0; i < 14; i++) {
            developmentCards.add(new DevelopmentCard(Kind.KNIGHT));
        }

        //Add the special cards
        for (int i = 0; i < 2; i++) {
            developmentCards.add(new DevelopmentCard(Kind.ROAD_BUILDING));
            developmentCards.add(new DevelopmentCard(Kind.MONOPOLY));
            developmentCards.add(new DevelopmentCard(Kind.YEAR_OF_PLENTY));
        }

        //Add the point cards
        for (int i = 0; i < 5; i++) {
            developmentCards.add(new DevelopmentCard(Kind.POINT));
        }

        //Shuffle the deck
        Collections.shuffle(developmentCards);

        return developmentCards;
    }

    public Kind getKind() {
        return kind;
    }
}
