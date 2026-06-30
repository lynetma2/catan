package com.sundtrack.catan.datalayer.dto.snapshot;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record DiceRollDTO(
        @JsonIgnore int die1,
        @JsonIgnore int die2
) {

    @JsonIgnore
    public int total() {
        return die1 + die2;
    }

    @JsonIgnore
    public boolean isSeven() {
        return total() == 7;
    }

    @JsonProperty("values")
    public List<Integer> values() {
        return List.of(die1, die2);
    }
}

