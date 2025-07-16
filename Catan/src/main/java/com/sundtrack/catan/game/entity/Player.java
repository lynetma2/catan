package com.sundtrack.catan.game.entity;

import java.util.ArrayList;
import java.util.List;

import static com.sundtrack.catan.game.entity.Game.*;

public class Player {
    private String name;
    private final int[] resources;
    private final ArrayList<Integer> developmentCards;
    private int points;

    public Player(String name) {
        this.name = name;
        this.resources = new int[]{0,0,0,0,0};
        this.developmentCards = new ArrayList<>();
        this.points = 0;
    }

    public int[] getResources() {
        return resources;
    }

    public List<Integer> getDevelopmentCards() {
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

    public static void setResources(Integer[] resources, Hex.TerrainKind kind, int amount) {
        switch (kind) {
            case ORE ->  resources[ORE_INDEX] = amount;
            case WOOL -> resources[WOOL_INDEX] = amount;
            case GRAIN -> resources[GRAIN_INDEX] = amount;
            case BRICK ->  resources[BRICK_INDEX] = amount;
            case LUMBER ->   resources[LUMBER_INDEX] = amount;
            case null, default -> System.out.println("Wrong kind for resource change");
        }
    }

    public static void addResources(Integer[] resources, Hex.TerrainKind kind, int amount) {
        switch (kind) {
            case ORE ->  resources[ORE_INDEX] += amount;
            case WOOL -> resources[WOOL_INDEX] += amount;
            case GRAIN -> resources[GRAIN_INDEX] += amount;
            case BRICK ->  resources[BRICK_INDEX] += amount;
            case LUMBER ->   resources[LUMBER_INDEX] += amount;
            case null, default -> System.out.println("Wrong kind for resource change");
        }
    }

    public static void removeResources(Integer[] resources, Hex.TerrainKind kind, int amount) {
        //TODO add checks...
        switch (kind) {
            case ORE ->  resources[ORE_INDEX] -= amount;
            case WOOL -> resources[WOOL_INDEX] -= amount;
            case GRAIN -> resources[GRAIN_INDEX] -= amount;
            case BRICK ->  resources[BRICK_INDEX] -= amount;
            case LUMBER ->   resources[LUMBER_INDEX] -= amount;
            case null, default -> System.out.println("Wrong kind for resource change");
        }
    }
}
