package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

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
}
