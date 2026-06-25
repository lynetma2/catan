package com.sundtrack.catan.datalayer.domain.building;

import java.util.UUID;

public interface BuildingView<T> {
    UUID getId();

    UUID getOwnerId();

    T getLocation();

    PieceType getKind();
}