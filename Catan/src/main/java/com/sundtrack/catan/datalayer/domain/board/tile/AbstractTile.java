package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;

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
}