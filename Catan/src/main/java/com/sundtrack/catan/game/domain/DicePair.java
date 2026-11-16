package com.sundtrack.catan.game.domain;

import java.util.Random;

public class DicePair {
    private final Random random;
    private DiceRoll diceRoll;

    public DicePair() {
        this(new Random());
    }
    public DicePair(long seed) {
        this(new Random(seed));
    }
    private DicePair(Random random) {
        this.random = random;
    }

    public DiceRoll roll() {
        int die1 = random.nextInt(6) + 1;
        int die2 = random.nextInt(6) + 1;
        diceRoll = new DiceRoll(die1, die2);

        return diceRoll;
    }

    public DiceRoll getDiceRoll() {
        return diceRoll;
    }
}
