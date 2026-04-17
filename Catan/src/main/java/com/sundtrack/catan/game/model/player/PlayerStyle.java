package com.sundtrack.catan.game.model.player;

public class PlayerStyle {
    private String fillColor;

    public PlayerStyle(String fillColor) {
        this.fillColor = fillColor;
    }

    public String getFillColor() {
        return fillColor;
    }

    public void setFillColor(String fillColor) {
        this.fillColor = fillColor;
    }
}