package com.sundtrack.catan.game;

public class ResourceTerrain extends Hex{

    private int dice;

    public ResourceTerrain(int q, int r, int s, TerrainKind kind, int dice) {
        super(q, r, s, kind);
        assert dice > 1 && dice < 13;
        this.dice = dice;
    }

    public int getDice() {
        return dice;
    }
}
