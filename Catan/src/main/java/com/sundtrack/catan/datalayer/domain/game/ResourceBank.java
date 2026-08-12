package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.exceptions.validation.InsufficientBankResourcesException;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.*;

public class ResourceBank {
    private final Map<ResourceType, Integer> resources;

    public ResourceBank(Map<ResourceType, Integer> resources) {
        this.resources = new EnumMap<>(resources);
    }

    public static ResourceBank standard() {
        Map<ResourceType, Integer> resources = new EnumMap<>(ResourceType.class);
        for (ResourceType resourceType : ResourceType.values()) {
            resources.put(resourceType, 19);
        }
        return new ResourceBank(resources);
    }

    public List<Resource> draw(ResourceType type, int amount) {
        if (available(type) < amount) {
            throw new InsufficientBankResourcesException(type, amount, available(type));
        }
        List<Resource> drawn = new ArrayList<>();
        for (int i = 0; i < amount; i++) {
            drawn.add(new Resource(UUID.randomUUID(), type));
        }
        resources.merge(type, -amount, Integer::sum);
        return drawn;
    }

    public int available(ResourceType resourceType) {
        return resources.get(resourceType);
    }

    public void deposit(List<Resource> resources) {
        for (Resource resource : resources) {
            this.resources.merge(resource.resourceType(), 1, Integer::sum);
        }
    }

    public boolean isAvailable(Map<ResourceType, Integer> requiredResources) {
        return requiredResources.entrySet()
                .stream()
                .allMatch(entry -> isAvailable(entry.getKey(), entry.getValue()));
    }

    public boolean isAvailable(ResourceType resourceType, int amount) {
        return available(resourceType) >= amount;
    }
}
