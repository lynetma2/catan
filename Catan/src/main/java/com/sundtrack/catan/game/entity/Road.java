package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.coordinates.EdgeCoordinates;
import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;
import com.sundtrack.catan.game.entity.coordinates.VertexCoordinates;

public class Road {

    private final EdgeCoordinates coordinates;
    private final String playerName;

    public Road(int q, int r, int s, EdgeCoordinates.Direction direction, String playerName) {
        this.coordinates = new EdgeCoordinates(q, r, s, direction);
        this.playerName = playerName;
    }

    public Road(int q, int r, EdgeCoordinates.Direction direction, String playerName) {
        this.coordinates = new EdgeCoordinates(q, r, direction);
        this.playerName = playerName;
    }

    public Road(EdgeCoordinates coordinates, String playerName) {
        this.coordinates = coordinates;
        this.playerName = playerName;
    }

    public HexCoordinates getCoordinates() {
        return coordinates;
    }

    public String getPlayerName() {
        return playerName;
    }

    public String toKey() {
        int q = coordinates.getQ();
        int r = coordinates.getR();
        int s = coordinates.getS();
        EdgeCoordinates.Direction direction = coordinates.getDirection();
        return "q" + q + "r" + r + "s" + s + "d" + direction;
    }
}
