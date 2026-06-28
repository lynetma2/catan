package com.sundtrack.catan.datalayer.dto.snapshot;

import java.util.ArrayList;
import java.util.List;

public record DiceRollDTO(int die1, int die2) {

    public int total() {
        return die1 + die2;
    }

    public boolean isSeven() {
        return total() == 7;
    }

    public List<Integer> toList() {
        return List.of(die1, die2);
    }
}
