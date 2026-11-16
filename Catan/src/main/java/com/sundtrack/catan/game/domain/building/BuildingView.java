package com.sundtrack.catan.game.domain.building;

import java.util.UUID;

public interface BuildingView<T> {
    UUID getId();

    UUID getOwnerId();

    T getLocation();

    PieceType getKind();
}