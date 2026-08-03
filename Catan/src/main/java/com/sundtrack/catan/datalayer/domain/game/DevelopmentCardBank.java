package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InsufficientDevelopmentCardsException;

import java.util.*;

public class DevelopmentCardBank {
    private final Deque<DevelopmentCardType> deck;

    public DevelopmentCardBank(Deque<DevelopmentCardType> deck) {
        this.deck = deck;
    }

    public static DevelopmentCardBank standard() {
        List<DevelopmentCardType> types = new ArrayList<>();
        addN(types, DevelopmentCardType.KNIGHT, 14);
        addN(types, DevelopmentCardType.VICTORY_POINT, 5);
        addN(types, DevelopmentCardType.MONOPOLY, 2);
        addN(types, DevelopmentCardType.ROAD_BUILDING, 2);
        addN(types, DevelopmentCardType.YEAR_OF_PLENTY, 2);
        Collections.shuffle(types);
        return new DevelopmentCardBank(new ArrayDeque<>(types));
    }

    private static void addN(List<DevelopmentCardType> types, DevelopmentCardType type, int amount) {
        for (int i = 0; i < amount; i++) {
            types.add(type);
        }
    }

    public static DevelopmentCardBank singleType(DevelopmentCardType type) {
        List<DevelopmentCardType> types = new ArrayList<>();
        addN(types, type, 25);
        return new DevelopmentCardBank(new ArrayDeque<>(types));
    }

    public int remaining() {
        return deck.size();
    }

    public DevelopmentCard draw(int currentTurn) {
        if (isEmpty()) {
            throw new InsufficientDevelopmentCardsException();
        }
        DevelopmentCardType type = deck.pop();
        return new DevelopmentCard(UUID.randomUUID(), type, currentTurn);
    }

    public boolean isEmpty() {
        return deck.isEmpty();
    }
}