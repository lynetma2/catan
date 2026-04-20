package com.sundtrack.catan.game.datalayer.dto.world;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VertexCoordinatesDTO extends BaseCoordinates {

    public enum VertexDirectionDTO {
        @JsonProperty("East") EAST,
        @JsonProperty("West") WEST
    }

    private VertexDirectionDTO direction;

    public VertexCoordinatesDTO() {
    }

    public VertexCoordinatesDTO(int q, int r, VertexDirectionDTO direction) {
        super(q, r);
        this.direction = direction;
    }

    public VertexDirectionDTO getDirection() {
        return direction;
    }

    public void setDirection(VertexDirectionDTO direction) {
        this.direction = direction;
    }
}