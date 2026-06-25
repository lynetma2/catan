package com.sundtrack.catan.datalayer.domain.building;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

public final class Building<T> implements BuildingView<T> {
    private final UUID id;
    private final UUID ownerId;
    private final T location;
    private final PieceType kind;

    private Building(UUID ownerId, T location, PieceType kind) {
        this.id = UUID.randomUUID();
        this.ownerId = ownerId;
        this.location = location;
        this.kind = kind;
    }

    public static Building<Vertex> settlement(UUID ownerId, Vertex location) {
        return new Building<>(ownerId, location, PieceType.SETTLEMENT);
    }

    public static Building<Vertex> city(UUID ownerId, Vertex location) {
        return new Building<>(ownerId, location, PieceType.CITY);
    }

    public static Building<Edge> road(UUID ownerId, Edge location) {
        return new Building<>(ownerId, location, PieceType.ROAD);
    }

    public static Building<Vertex> upgradeToCity(Building<Vertex> settlement) {
        if (settlement.getKind() != PieceType.SETTLEMENT) {
            throw new IllegalArgumentException("Only a settlement can be upgraded to a city");
        }
        return city(settlement.getOwnerId(), settlement.getLocation());
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public UUID getOwnerId() {
        return ownerId;
    }

    @Override
    public T getLocation() {
        return location;
    }

    @Override
    public PieceType getKind() {
        return kind;
    }
}