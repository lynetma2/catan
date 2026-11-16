package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;

import java.util.Random;

public class DicePair {
    private final Random random;
    private DiceRollDTO diceRollDTO;

    public DicePair() {
        this(new Random());
    }
    public DicePair(long seed) {
        this(new Random(seed));
    }
    private DicePair(Random random) {
        this.random = random;
    }

    public DiceRollDTO roll() {
        int die1 = random.nextInt(6) + 1;
        int die2 = random.nextInt(6) + 1;
        diceRollDTO = new DiceRollDTO(die1, die2);

        return diceRollDTO;
    }

    public DiceRollDTO getDiceRollDTO() {
        return diceRollDTO;
    }
}
