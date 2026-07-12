package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InsufficientDevelopmentCardsException;

import java.util.*;

public class DevelopmentCardBank {
    private final Deque<DevelopmentCard> deck;

    public DevelopmentCardBank(Deque<DevelopmentCard> deck) {
        this.deck = deck;
    }

    public static DevelopmentCardBank standard() {
        List<DevelopmentCard> cards = new ArrayList<>();
        addN(cards, DevelopmentCardType.KNIGHT, 14);
        addN(cards, DevelopmentCardType.VICTORY_POINT, 5);
        addN(cards, DevelopmentCardType.MONOPOLY, 2);
        addN(cards, DevelopmentCardType.ROAD_BUILDING, 2);
        addN(cards, DevelopmentCardType.YEAR_OF_PLENTY, 2);
        Collections.shuffle(cards);
        return new DevelopmentCardBank(new ArrayDeque<>(cards));
    }

    private static void addN(List<DevelopmentCard> cards, DevelopmentCardType type, int amount) {
        for (int i = 0; i < amount; i++) {
            cards.add(new DevelopmentCard(UUID.randomUUID(), type));
        }
    }

    public int remaining() {
        return deck.size();
    }

    public DevelopmentCard draw() {
        if (isEmpty()) {
            throw new InsufficientDevelopmentCardsException();
        }
        return deck.pop();
    }

    public boolean isEmpty() {
        return deck.isEmpty();
    }
}
