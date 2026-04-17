package com.sundtrack.catan.game.dto.events;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ResourceTypeDTO {
    @JsonProperty("Wood") WOOD,
    @JsonProperty("Brick") BRICK,
    @JsonProperty("Sheep") SHEEP,
    @JsonProperty("Wheat") WHEAT,
    @JsonProperty("Ore") ORE
}