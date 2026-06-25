package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.List;

public abstract class AbstractTile implements Tile {
    private final Hex hex;
    private final TileKind kind;
    private final TileType type;
    private final Integer number;
    private final Boolean hasRobber;
    private final Boolean isPort;
    private final PortType portType;
    private final Integer portFacing;

    protected AbstractTile(
            Hex hex,
            TileKind kind,
            TileType type,
            Integer number,
            Boolean hasRobber,
            Boolean isPort,
            PortType portType,
            Integer portFacing
    ) {
        this.hex = hex;
        this.kind = kind;
        this.type = type;
        this.number = number;
        this.hasRobber = hasRobber;
        this.isPort = isPort;
        this.portType = portType;
        this.portFacing = portFacing;
    }

    public Hex getHex() {
        return hex;
    }

    public TileKind getKind() {
        return kind;
    }

    public TileType getType() {
        return type;
    }

    public Integer getNumber() {
        return number;
    }

    public Boolean hasRobber() {
        return hasRobber;
    }

    public Boolean isPort() {
        return isPort;
    }

    public PortType getPortType() {
        return portType;
    }

    public Integer getPortFacing() {
        return portFacing;
    }

    @Override
    public List<Vertex> getAdjacentVertices() {
        int q = hex.q();
        int r = hex.r();

        return List.of(
                Vertex.of(q, r, 0, 1),
                Vertex.of(q, r, 1, 2),
                Vertex.of(q, r, 2, 3),
                Vertex.of(q, r, 3, 4),
                Vertex.of(q, r, 4, 5),
                Vertex.of(q, r, 5, 0)
        );
    }
}