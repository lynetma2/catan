package com.sundtrack.catan.game.model.player;

import com.sundtrack.catan.game.model.enums.ResourceType;
import java.util.EnumMap;
import java.util.Map;

public class Inventory {
    private Map<ResourceType, Integer> resources;
    private int hiddenCount;

    public Inventory() {
        this.resources = new EnumMap<>(ResourceType.class);
        for (ResourceType type : ResourceType.values()) {
            this.resources.put(type, 0);
        }
        this.hiddenCount = 0;
    }

    public Map<ResourceType, Integer> getResources() {
        return resources;
    }

    public void setResources(Map<ResourceType, Integer> resources) {
        this.resources = resources;
    }

    public int getHiddenCount() {
        return hiddenCount;
    }

    public void setHiddenCount(int hiddenCount) {
        this.hiddenCount = hiddenCount;
    }

    public void addResource(ResourceType type, int count) {
        this.resources.put(type, this.resources.get(type) + count);
    }

    public void removeResource(ResourceType type, int count) {
        int current = this.resources.get(type);
        if (current < count) {
            throw new IllegalStateException("Not enough resources");
        }
        this.resources.put(type, current - count);
    }

    public boolean hasResources(Map<ResourceType, Integer> cost) {
        return cost.entrySet().stream()
                .allMatch(entry -> resources.getOrDefault(entry.getKey(), 0) >= entry.getValue());
    }

    public void removeResources(Map<ResourceType, Integer> cost) {
        if (!hasResources(cost)) {
            throw new IllegalStateException("Not enough resources");
        }
        cost.forEach(this::removeResource);
    }
}