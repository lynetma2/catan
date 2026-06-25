package com.sundtrack.catan.datalayer.dto.snapshot;

public record DiceRollDTO(int die1, int die2) {

    public int total() {
        return die1 + die2;
    }

    public boolean isSeven() {
        return total() == 7;
    }
}
