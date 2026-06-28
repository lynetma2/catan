package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.building.PieceCosts;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.InsufficientResourcesException;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class GamePlayer {
    private UUID id;
    private String username;
    private String color;
    private List<Resource> resources;
    private List<DevelopmentCard> developmentCards;
    private Integer victoryPoints;
    private Integer cardCount;
    private Integer developmentCardCount;
    private Boolean hasLongestRoad;
    private Boolean hasLargestArmy;
    private Integer robbersUsed;

    public GamePlayer(UUID id, String username, String color, List<Resource> resources, List<DevelopmentCard> developmentCards, Integer victoryPoints, Integer cardCount, Integer developmentCardCount, Boolean hasLongestRoad, Boolean hasLargestArmy, Integer robbersUsed) {
        this.id = id;
        this.username = username;
        this.color = color;
        this.resources = resources;
        this.developmentCards = developmentCards;
        this.victoryPoints = victoryPoints;
        this.cardCount = cardCount;
        this.developmentCardCount = developmentCardCount;
        this.hasLongestRoad = hasLongestRoad;
        this.hasLargestArmy = hasLargestArmy;
        this.robbersUsed = robbersUsed;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<DevelopmentCard> getDevelopmentCards() {
        return developmentCards;
    }

    public void setDevelopmentCards(List<DevelopmentCard> developmentCards) {
        this.developmentCards = developmentCards;
    }

    public Integer getVictoryPoints() {
        return victoryPoints;
    }

    public void setVictoryPoints(Integer victoryPoints) {
        this.victoryPoints = victoryPoints;
    }

    public Integer getCardCount() {
        return cardCount;
    }

    public void setCardCount(Integer cardCount) {
        this.cardCount = cardCount;
    }

    public Boolean getHasLongestRoad() {
        return hasLongestRoad;
    }

    public void setHasLongestRoad(Boolean hasLongestRoad) {
        this.hasLongestRoad = hasLongestRoad;
    }

    public Boolean getHasLargestArmy() {
        return hasLargestArmy;
    }

    public void setHasLargestArmy(Boolean hasLargestArmy) {
        this.hasLargestArmy = hasLargestArmy;
    }

    public Integer getRobbersUsed() {
        return robbersUsed;
    }

    public void setRobbersUsed(Integer robbersUsed) {
        this.robbersUsed = robbersUsed;
    }

    public Integer getDevelopmentCardCount() {
        return developmentCardCount;
    }

    public void setDevelopmentCardCount(Integer developmentCardCount) {
        this.developmentCardCount = developmentCardCount;
    }

    public void validateCanAfford(PieceType pieceType) {
        Map<ResourceType, Long> available = resources.stream()
                .collect(Collectors.groupingBy(Resource::resourceType, Collectors.counting()));

        Map<ResourceType, Integer> cost = PieceCosts.of(pieceType);

        boolean canAfford = cost.entrySet().stream()
                .allMatch(entry -> available.getOrDefault(entry.getKey(), 0L) >= entry.getValue());

        if (!canAfford) {
            throw new InsufficientResourcesException(id, pieceType);
        }
    }

    public List<Resource> deduct(PieceType pieceType) {
        Map<ResourceType, Integer> cost = PieceCosts.of(pieceType);
        List<Resource> spent = new ArrayList<>();

        for (Map.Entry<ResourceType, Integer> entry : cost.entrySet()) {
            ResourceType type = entry.getKey();
            int remainingToRemove = entry.getValue();

            Iterator<Resource> it = resources.iterator();
            while (it.hasNext() && remainingToRemove > 0) {
                Resource resource = it.next();
                if (resource.resourceType() == type) {
                    spent.add(resource);
                    it.remove();
                    remainingToRemove--;
                }
            }
        }

        this.cardCount = resources.size();
        return spent;
    }

    public List<Resource> grant(ResourceType resourceType, int amount) {
        List<Resource> addedResources = new ArrayList<>();

        for (int i = 1; i <= amount; i++) {
            Resource resource = new Resource(UUID.randomUUID(), resourceType);
            this.resources.add(resource);
            addedResources.add(resource);
        }

        return addedResources;
    }

    public Resource steal() {
        if (resources.isEmpty()) {
            throw new IllegalStateException("Cannot steal from player with no resources");
        }

        // Choose a random index – each card has the same chance of being selected
        int index = ThreadLocalRandom.current().nextInt(resources.size());
        Resource stolen = resources.remove(index);

        // Keep the card count in sync
        this.cardCount = resources.size();

        return stolen;
    }

    public void addResource(Resource resource) {
        this.resources.add(resource);
    }

    public boolean hasResources() {
        return !resources.isEmpty();
    }

    public Integer getResourceCount() {
        return resources.size();
    }
}
