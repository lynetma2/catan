package com.sundtrack.catan.game;

import java.util.ArrayList;

public class Player {
    private String name;
    private final ArrayList<Integer> resources;
    private final ArrayList<Integer> developmentCards;
    private int points;

    public Player(String name) {
        this.name = name;
        this.resources = new ArrayList<>();
        this.developmentCards = new ArrayList<>();
        this.points = 0;
    }

    public ArrayList<Integer> getResources() {
        return resources;
    }

    public ArrayList<Integer> getDevelopmentCards() {
        return developmentCards;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}
