package com.sundtrack.catan.game.entity;

import com.sundtrack.catan.game.entity.coordinates.HexCoordinates;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MapBuilder {

    public static Board classicNotRandom() {
        ArrayList<Hex> map = new ArrayList<>();

        //Hardcoded cuz not random
        //Border
        map.add(new Hex(0,-3,3, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(1,-3,2, PortTerrain.TradeKind.ANY));
        map.add(new Hex(2,-3,1, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(3,-3,0, PortTerrain.TradeKind.ANY));
        map.add(new Hex(3,-2,-1, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(3,-2,-1, PortTerrain.TradeKind.BRICK));
        map.add(new Hex(3,0,-3, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(2,1,-3, PortTerrain.TradeKind.LUMBER));
        map.add(new Hex(1,2,-3, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(0,3,-3, PortTerrain.TradeKind.ANY));
        map.add(new Hex(-1,3,-2, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-2,3,-1, PortTerrain.TradeKind.GRAIN));
        map.add(new Hex(-3,3,0, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-3,2,-1, PortTerrain.TradeKind.ORE));
        map.add(new Hex(-3,1,2, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-3,0,3, PortTerrain.TradeKind.ANY));
        map.add(new Hex(-2,-1,3, Hex.TerrainKind.SEA));
        map.add(new PortTerrain(-1,-2,3, PortTerrain.TradeKind.WOOL));

        //Internal
        map.add(new ResourceTerrain(0,-2,2, Hex.TerrainKind.BRICK, 5));
        map.add(new ResourceTerrain(-1,-1,2, Hex.TerrainKind.BRICK, 2));
        map.add(new ResourceTerrain(-2,0,2, Hex.TerrainKind.ORE, 6));

        map.add(new ResourceTerrain(-2,1,1, Hex.TerrainKind.GRAIN, 3));
        map.add(new ResourceTerrain(-2,2,0, Hex.TerrainKind.BRICK, 8));
        map.add(new ResourceTerrain(-1,2,-1, Hex.TerrainKind.GRAIN, 10));
        map.add(new ResourceTerrain(0,2,-2, Hex.TerrainKind.LUMBER, 9));

        map.add(new ResourceTerrain(1,1,-2, Hex.TerrainKind.WOOL, 12));
        map.add(new ResourceTerrain(2,0,-2, Hex.TerrainKind.ORE, 11));
        map.add(new Hex(2,-1,-1, Hex.TerrainKind.DESERT));
        map.add(new ResourceTerrain(2,-2,0, Hex.TerrainKind.WOOL, 4));
        map.add(new ResourceTerrain(1,-2,1, Hex.TerrainKind.WOOL, 8));

        map.add(new ResourceTerrain(0,-1,1, Hex.TerrainKind.ORE, 10));
        map.add(new ResourceTerrain(-1,0,1, Hex.TerrainKind.GRAIN, 9));
        map.add(new ResourceTerrain(-1,1,0, Hex.TerrainKind.LUMBER, 4));
        map.add(new ResourceTerrain(0,1,-1, Hex.TerrainKind.GRAIN, 5));

        map.add(new ResourceTerrain(1,0,-1, Hex.TerrainKind.LUMBER, 6));
        map.add(new ResourceTerrain(1,-1,0, Hex.TerrainKind.LUMBER, 3));
        map.add(new ResourceTerrain(0,0,0, Hex.TerrainKind.WOOL, 11));

        Map<String, Hex> mapmap = new HashMap<>();
        map.forEach(hex -> mapmap.put(hex.toKey(), hex));

        return new Board(mapmap, new HexCoordinates(0,3));
    }


}
