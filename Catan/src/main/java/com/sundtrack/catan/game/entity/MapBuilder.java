package com.sundtrack.catan.game.entity;

import java.util.ArrayList;

public class MapBuilder {

    public static ArrayList<Hex> classicNotRandom() {
        ArrayList<Hex> map = new ArrayList<>();

        //Hardcoded cuz not random
        //Border
        map.add(new Hex(0,0,0, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(1,0,-1, PortTerrain.TradeKind.ANY));
        map.add(new Hex(2,0,-2, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(3,0,-3, PortTerrain.TradeKind.ANY));
        map.add(new Hex(3,1,-4, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(3,2,-5, PortTerrain.TradeKind.BRICK));
        map.add(new Hex(3,3,-6, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(2,4,-6, PortTerrain.TradeKind.LUMBER));
        map.add(new Hex(1,5,-6, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(0,6,-6, PortTerrain.TradeKind.ANY));
        map.add(new Hex(-1,6,-5, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-2,6,-4, PortTerrain.TradeKind.GRAIN));
        map.add(new Hex(-3,6,-3, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-3,5,-2, PortTerrain.TradeKind.ORE));
        map.add(new Hex(-3,4,-1, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-3,3,0, PortTerrain.TradeKind.ANY));
        map.add(new Hex(-2,2,0, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-1,1,0, PortTerrain.TradeKind.WOOL));

        //Internal
        map.add(new ResourceTerrain(0,1,-1, Hex.TerrainKind.ORE, 8));
        map.add(new ResourceTerrain(1,1,-2, Hex.TerrainKind.LUMBER, 4));
        map.add(new ResourceTerrain(2,1,-3, Hex.TerrainKind.BRICK, 6));

        map.add(new ResourceTerrain(-1,2,-1, Hex.TerrainKind.GRAIN, 11));
        map.add(new ResourceTerrain(0,2,-2, Hex.TerrainKind.LUMBER, 2));
        map.add(new ResourceTerrain(1,2,-3, Hex.TerrainKind.ORE, 12));
        map.add(new ResourceTerrain(2,2,-4, Hex.TerrainKind.WOOL, 10));

        map.add(new ResourceTerrain(-2,3,-1, Hex.TerrainKind.ORE, 5));
        map.add(new ResourceTerrain(-1,3,-2, Hex.TerrainKind.WOOL, 9));
        map.add(new Hex(0,3,-3, Hex.TerrainKind.DESERT));
        map.add(new ResourceTerrain(1,3,-4, Hex.TerrainKind.GRAIN, 11));
        map.add(new ResourceTerrain(2,3,-5, Hex.TerrainKind.GRAIN, 9));

        map.add(new ResourceTerrain(-2,4,-2, Hex.TerrainKind.GRAIN, 3));
        map.add(new ResourceTerrain(-1,4,-3, Hex.TerrainKind.LUMBER, 8));
        map.add(new ResourceTerrain(0,4,-4, Hex.TerrainKind.BRICK, 3));
        map.add(new ResourceTerrain(1,4,-5, Hex.TerrainKind.WOOL, 6));

        map.add(new ResourceTerrain(-2,5,-3, Hex.TerrainKind.WOOL, 10));
        map.add(new ResourceTerrain(-2,5,-3, Hex.TerrainKind.BRICK, 4));
        map.add(new ResourceTerrain(-2,5,-3, Hex.TerrainKind.LUMBER, 5));

        return map;
    }


}
