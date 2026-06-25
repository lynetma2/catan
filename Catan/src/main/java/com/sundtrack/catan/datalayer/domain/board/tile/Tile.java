package com.sundtrack.catan.datalayer.domain.board.tile;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.List;

public interface Tile {
    Hex getHex();

    TileKind getKind();

    TileType getType();

    Integer getNumber();

    Boolean hasRobber();

    Boolean isPort();

    PortType getPortType();

    Integer getPortFacing();

    List<Vertex> getAdjacentVertices();
}
