package com.sundtrack.catan.game.model.board;

import com.sundtrack.catan.game.model.coordinates.HexCoordinates;
import com.sundtrack.catan.game.model.enums.ResourceType;
import com.sundtrack.catan.game.model.enums.TileKind;

public class Tile {
    private HexCoordinates hex;
    private TileKind tileKind;
    private ResourceType resourceType; // Optional
    private Integer dice; // Optional

    public Tile(HexCoordinates hex, TileKind tileKind, ResourceType resourceType, Integer dice) {
        this.hex = hex;
        this.tileKind = tileKind;
        this.resourceType = resourceType;
        this.dice = dice;
    }

    public HexCoordinates getHex() {
        return hex;
    }

    public TileKind getTileKind() {
        return tileKind;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public Integer getDice() {
        return dice;
    }
}