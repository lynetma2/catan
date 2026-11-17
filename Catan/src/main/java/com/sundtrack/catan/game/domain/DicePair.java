package com.sundtrack.catan.game.domain;

import java.util.Random;

public class DicePair {
    private final long seed;
    private final Random random;
    private int rollCount;
    private DiceRoll diceRoll;

    public DicePair() {
        this(new Random().nextLong());   // generate AND remember a seed
    }

    public DicePair(long seed) {
        this.seed = seed;
        this.random = new Random(seed);
        this.rollCount = 0;
    }

    public static DicePair restore(long seed, int rollCount, DiceRoll lastRoll) {
        DicePair pair = new DicePair(seed);
        for (int i = 0; i < rollCount * 2; i++) {
            pair.random.nextInt(6);      // replay consumed rolls to reach the saved state
        }
        pair.rollCount = rollCount;
        pair.diceRoll = lastRoll;
        return pair;
    }

    public DiceRoll roll() {
        int die1 = random.nextInt(6) + 1;
        int die2 = random.nextInt(6) + 1;
        diceRoll = new DiceRoll(die1, die2);
        rollCount++;
        return diceRoll;
    }

    public long getSeed() { return seed; }
    public int getRollCount() { return rollCount; }
    public DiceRoll getDiceRoll() { return diceRoll; }
}