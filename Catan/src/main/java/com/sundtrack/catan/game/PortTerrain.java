package com.sundtrack.catan.game;

public class PortTerrain extends Hex {
    enum TradeKind {
        LUMBER,
        BRICK,
        GRAIN,
        WOOL,
        ORE,
        ANY
    }

    private TradeKind tradeKind;

    public PortTerrain(int q, int r, int s, TradeKind tradeKind) {
        super(q, r, s, TerrainKind.PORT);
        this.tradeKind = tradeKind;
    }

    public TradeKind getTradeKind() {
        return tradeKind;
    }

    public int getRatio() {
        switch (tradeKind) {
            case LUMBER:
            case BRICK:
            case GRAIN:
            case WOOL:
            case ORE:
                return 2;
            case ANY:
                return 3;
        }

        //THIS SHOULD NOT HAPPEN!
        return 0;
    }
}
