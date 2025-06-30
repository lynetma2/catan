package com.sundtrack.catan.game;

import java.util.ArrayList;

public class Board {

    private ArrayList<Hex> map;
    private ArrayList<Road> roads;
    private ArrayList<Vertex> buildings;

    public Board(ArrayList<Hex> map) {
        this.map = map;
        this.roads = new ArrayList<>();
        this.buildings = new ArrayList<>();
    }
}
