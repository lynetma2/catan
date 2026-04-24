package com.sundtrack.catan.datalayer.domain.building;

import java.util.UUID;

public interface Building<T> {
    UUID getId();
    UUID getPlayerId();
    T getLocation();
    BuildingKind getKind();
}
