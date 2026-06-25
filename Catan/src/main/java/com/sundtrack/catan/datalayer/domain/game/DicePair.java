package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;

import java.util.Random;

public class DicePair {
    private static final Random RANDOM = new Random();
    private DiceRollDTO diceRollDTO;

    public DiceRollDTO roll() {
        int die1 = RANDOM.nextInt(6) + 1;
        int die2 = RANDOM.nextInt(6) + 1;
        diceRollDTO = new DiceRollDTO(die1, die2);

        return diceRollDTO;
    }

    public DiceRollDTO getDiceRollDTO() {
        return diceRollDTO;
    }
}
