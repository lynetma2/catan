package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.cards.DevelopmentCard;

import java.util.ArrayList;
import java.util.List;

import static com.sundtrack.catan.game.entity.Game.*;

public class Player {
    private String name;
    private final Integer[] resources;
    private final ArrayList<DevelopmentCard> developmentCards;
    private int points;

    public Player(String name) {
        this.name = name;
        this.resources = new Integer[]{0,0,0,0,0};
        this.developmentCards = new ArrayList<>();
        this.points = 0;
    }

    public Integer[] getResources() {
        return resources;
    }

    public List<DevelopmentCard> getDevelopmentCards() {
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

    public static void batchRemoveResources(Integer[] resources, Integer[] removal) {
        for (int i = 0; i < resources.length; i++) {
            if (resources[i] - removal[i] < 0) {
                throw new IllegalStateException("There are not enough resources for this action!");
            }
            resources[i] -= removal[i];
        }
    }

    public static void batchAddResources(Integer[] resources, Integer[] addition) {
        for (int i = 0; i < resources.length; i++) {
            resources[i] += addition[i];
        }
    }
}
