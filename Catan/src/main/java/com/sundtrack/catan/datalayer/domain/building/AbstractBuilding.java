package com.sundtrack.catan.datalayer.domain.building;

import java.util.UUID;

abstract class AbstractBuilding<T> implements Building<T> {
    private final UUID id;
    private final UUID playerId;
    private final T location;
    private final BuildingKind kind;

    protected AbstractBuilding(UUID playerId, T location, BuildingKind kind) {
        this.id = UUID.randomUUID();
        this.playerId = playerId;
        this.location = location;
        this.kind = kind;
    }

    public UUID getId() { return id; }
    public UUID getPlayerId() { return playerId; }
    public T getLocation() { return location; }
    public BuildingKind getKind() { return kind; }
}
