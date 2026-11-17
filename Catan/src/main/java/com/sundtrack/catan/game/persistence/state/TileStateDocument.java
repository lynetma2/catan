package com.sundtrack.catan.game.persistence.state;

public record TileStateDocument(
        int q,
        int r,
        String kind,
        String type,
        Integer number,
        String portType,
        Integer portFacing
) {}