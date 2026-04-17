package com.sundtrack.catan.game.model.board;

import com.sundtrack.catan.game.model.coordinates.EdgeCoordinates;

public class Road {
    private EdgeCoordinates edge;
    private String playerName;

    public Road(EdgeCoordinates edge, String playerName) {
        this.edge = edge;
        this.playerName = playerName;
    }

    public EdgeCoordinates getEdge() {
        return edge;
    }

    public String getPlayerName() {
        return playerName;
    }
    
    public String toKey() {
        return edge.toKey();
    }
}