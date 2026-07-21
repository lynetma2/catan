package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.building.PieceCosts;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCardType;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

public class GamePlayer {
    private final UUID id;
    private final List<Resource> resources;
    private final List<DevelopmentCard> developmentCards;
    private String username;
    private String color;
    private int knightsUsed;

    public GamePlayer(UUID id, String username, String color, List<Resource> resources,
                      List<DevelopmentCard> developmentCards, int knightsUsed) {
        this.id = id;
        this.username = username;
        this.color = color;
        this.resources = resources;
        this.developmentCards = developmentCards;
        this.knightsUsed = knightsUsed;
    }

    public UUID getId() {
        return id;
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

    /**
     * Read-only view — mutate via deduct/grant/steal/addResource/removeResources instead.
     */
    public List<Resource> getResources() {
        return Collections.unmodifiableList(resources);
    }

    /**
     * Read-only view — mutate via development-card-specific methods once those exist.
     */
    public List<DevelopmentCard> getDevelopmentCards() {
        return Collections.unmodifiableList(developmentCards);
    }

    public int getCardCount() {
        return resources.size();
    }

    public int getDevelopmentCardCount() {
        return developmentCards.size();
    }

    public int getKnightsUsed() {
        return knightsUsed;
    }

    public void incrementKnightsUsed() {
        this.knightsUsed++;
    }

    public void validateCanAfford(PieceType pieceType) {
        Map<ResourceType, Long> available = countsByType();
        Map<ResourceType, Integer> cost = PieceCosts.of(pieceType);

        boolean canAfford = cost.entrySet().stream()
                .allMatch(entry -> available.getOrDefault(entry.getKey(), 0L) >= entry.getValue());

        if (!canAfford) {
            throw new InsufficientResourcesException(id, pieceType);
        }
    }

    private Map<ResourceType, Long> countsByType() {
        return resources.stream()
                .collect(Collectors.groupingBy(Resource::resourceType, Collectors.counting()));
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

        return spent;
    }

    /**
     * Removes specific resources by id — e.g. for discard, where the player chooses exact cards.
     */
    public List<Resource> removeResources(List<UUID> resourceIds) {
        List<Resource> removed = new ArrayList<>();
        for (UUID resourceId : resourceIds) {
            Resource match = resources.stream()
                    .filter(r -> r.uid().equals(resourceId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotOwnedException(id, resourceId));
            resources.remove(match);
            removed.add(match);
        }
        return removed;
    }

    public void receive(List<Resource> resources) {
        this.resources.addAll(resources);
    }

    public Resource steal() {
        if (resources.isEmpty()) {
            throw new IllegalStateException("Cannot steal from player with no resources");
        }

        // Choose a random index – each card has the same chance of being selected
        int index = ThreadLocalRandom.current().nextInt(resources.size());
        return resources.remove(index);
    }

    public void addResource(Resource resource) {
        this.resources.add(resource);
    }

    public void addResources(List<Resource> resources) {
        this.resources.addAll(resources);
    }

    public void addDevelopmentCard(DevelopmentCard developmentCard) {
        this.developmentCards.add(developmentCard);
    }

    public boolean hasResources() {
        return !resources.isEmpty();
    }

    public int getResourceCount() {
        return resources.size();
    }

    public long getVictoryPointCardCount() {
        return developmentCards
                .stream()
                .filter(c -> c.getType() == DevelopmentCardType.VICTORY_POINT)
                .count();
    }

    public DevelopmentCard useDevelopmentCard(UUID cardId, DevelopmentCardType expectedType, int currentTurn) {
        DevelopmentCard card = developmentCards.stream()
                .filter(c -> c.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new DevelopmentCardNotOwnedException(id, cardId));

        if (card.getType() != expectedType) {
            throw new WrongDevelopmentCardTypeException(cardId, expectedType, card.getType());
        }
        if (!card.isPlayable(currentTurn)) {
            throw new DevelopmentCardNotPlayableException(cardId);
        }

        developmentCards.remove(card);
        return card;
    }

    public List<Resource> removeResourcesOfType(ResourceType resourceType) {
        List<Resource> resourcesToRemove = resources
                .stream()
                .filter(r -> r.resourceType() == resourceType)
                .toList();

        for (Resource resource : resourcesToRemove) {
            resources.remove(resource);
        }

        return resourcesToRemove;
    }


}