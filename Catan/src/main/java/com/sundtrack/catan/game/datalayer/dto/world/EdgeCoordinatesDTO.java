package com.sundtrack.catan.game.datalayer.dto.world;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EdgeCoordinatesDTO extends BaseCoordinates {

    public enum EdgeDirectionDTO {
        @JsonProperty("North") NORTH,
        @JsonProperty("East") EAST,
        @JsonProperty("West") WEST
    }

    private EdgeDirectionDTO direction;

    public EdgeCoordinatesDTO() {
    }

    public EdgeCoordinatesDTO(int q, int r, EdgeDirectionDTO direction) {
        super(q, r);
        this.direction = direction;
    }

    public EdgeDirectionDTO getDirection() {
        return direction;
    }

    public void setDirection(EdgeDirectionDTO direction) {
        this.direction = direction;
    }
}