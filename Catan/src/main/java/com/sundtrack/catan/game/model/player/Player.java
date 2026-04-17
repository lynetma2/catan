package com.sundtrack.catan.game.model.player;

import com.sundtrack.catan.game.entity.cards.DevelopmentCard; // Assuming this stays or moves later
import com.sundtrack.catan.game.model.enums.ResourceType;

import java.util.ArrayList;
import java.util.List;

public class Player {
    private String playerName;
    private final Inventory inventory;
    private final ArrayList<DevelopmentCard> developmentCards;
    private int points;
    private boolean isActive;
    private PlayerStyle style;

    public Player(String playerName, PlayerStyle style) {
        this.playerName = playerName;
        this.inventory = new Inventory();
        this.developmentCards = new ArrayList<>();
        this.points = 0;
        this.isActive = false;
        this.style = style;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public List<DevelopmentCard> getDevelopmentCards() {
        return developmentCards;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public PlayerStyle getStyle() {
        return style;
    }

    public void setStyle(PlayerStyle style) {
        this.style = style;
    }

    public void addResource(ResourceType type, int amount) {
        inventory.addResource(type, amount);
    }
}
