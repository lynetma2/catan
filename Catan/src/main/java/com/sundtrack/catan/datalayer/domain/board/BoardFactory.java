package com.sundtrack.catan.datalayer.domain.board;

import com.sundtrack.catan.datalayer.domain.board.tile.*;
import org.springframework.stereotype.Component;

import java.util.*;

import static com.sundtrack.catan.common.CollectionUtils.shuffled;

@Component
public class BoardFactory {

    // Standard Catan tile distribution
    private static final List<TileType> LAND_TILE_DISTRIBUTION = List.of(
            TileType.FOREST, TileType.FOREST, TileType.FOREST, TileType.FOREST,
            TileType.FIELDS, TileType.FIELDS, TileType.FIELDS, TileType.FIELDS,
            TileType.PASTURE, TileType.PASTURE, TileType.PASTURE, TileType.PASTURE,
            TileType.MOUNTAINS, TileType.MOUNTAINS, TileType.MOUNTAINS,
            TileType.HILLS, TileType.HILLS, TileType.HILLS,
            TileType.DESERT
    );

    private static final List<PortType> PORT_TILE_DISTRIBUTION = List.of(
            PortType.LUMBER, PortType.BRICK, PortType.GRAIN, PortType.WOOL, PortType.ORE,
            PortType.ANY, PortType.ANY, PortType.ANY, PortType.ANY
    );

    // Standard number token distribution (placed on non-desert tiles)
    private static final List<Integer> NUMBER_DISTRIBUTION = List.of(
            2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12
    );

    // Standard Catan hex coordinates in cube format (q, r, s)
    private static final List<Hex> LAND_COORDINATES = List.of(
            // Center
            new Hex(0, 0, 0),
            // Inner ring
            new Hex(1, -1, 0), new Hex(1, 0, -1),
            new Hex(0, 1, -1), new Hex(-1, 1, 0),
            new Hex(-1, 0, 1), new Hex(0, -1, 1),
            // Outer ring
            new Hex(2, -2, 0), new Hex(2, -1, -1),
            new Hex(2, 0, -2), new Hex(1, 1, -2),
            new Hex(0, 2, -2), new Hex(-1, 2, -1),
            new Hex(-2, 2, 0), new Hex(-2, 1, 1),
            new Hex(-2, 0, 2), new Hex(-1, -1, 2),
            new Hex(0, -2, 2), new Hex(1, -2, 1)
    );

    private static final List<Hex> SEA_COORDINATES = List.of(
            new Hex(2, -3, 1), new Hex(0, -3, 3),
            new Hex(-2, -1, 3), new Hex(-3, 1, 2),
            new Hex(-3, 3, 0),
            new Hex(-1, 3, -2), new Hex(1, 2, -3),
            new Hex(3, 0, -3), new Hex(3, -2, -1)
    );

    private static final List<Hex> PORT_COORDINATES = List.of(
            new Hex(3, -3, 0), new Hex(1, -3, 2),
            new Hex(-1, -2, 3), new Hex(-3, 0, 3),
            new Hex(-3, 2, 1), new Hex(-2, 3, -1),
            new Hex(0, 3, -3), new Hex(2, 1, -3),
            new Hex(3, -1, -2)
    );

    // Fixed layout for testing — always produces the same board
    public Board createStatic() {
        return buildBoard(PORT_TILE_DISTRIBUTION, LAND_TILE_DISTRIBUTION, NUMBER_DISTRIBUTION);
    }

    // Seeded random — reproducible but shuffled
    public Board createSeeded(long seed) {
        Random random = new Random(seed);
        List<PortType> portTypes = shuffled(PORT_TILE_DISTRIBUTION, random);
        List<TileType> landTiles = shuffled(LAND_TILE_DISTRIBUTION, random);
        List<Integer> numbers = shuffled(NUMBER_DISTRIBUTION, random);
        return buildBoard(portTypes, landTiles, numbers);
    }

    // Fully random
    public Board createRandom() {
        return createSeeded(new Random().nextLong());
    }

    private Board buildBoard(List<PortType> portTiles, List<TileType> landTiles, List<Integer> numbers) {
        List<Tile> tiles = new ArrayList<>();

        // 1. Map Hexes to TileTypes first (so we know where the Desert is)
        List<TileType> landTileQueue = new ArrayList<>(landTiles);
        Map<Hex, TileType> terrainMap = new LinkedHashMap<>();
        List<Hex> nonDesertHexes = new ArrayList<>();

        for (Hex coord : LAND_COORDINATES) {
            TileType type = landTileQueue.removeFirst();
            terrainMap.put(coord, type);
            if (type != TileType.DESERT) {
                nonDesertHexes.add(coord);
            }
        }

        // 2. Solve for valid number assignments using Backtracking
        Map<Hex, Integer> numberAssignment = new HashMap<>();
        boolean solved = backtrackNumbers(0, nonDesertHexes, new ArrayList<>(numbers), numberAssignment);

        if (!solved) {
            // Fallback: This rarely happens with standard Catan distribution,
            // but is good practice for seeds that might be impossible.
            throw new IllegalStateException("Could not generate a valid board layout for the given seed.");
        }

        // 3. Construct the actual Tile objects
        for (Hex coord : LAND_COORDINATES) {
            TileType type = terrainMap.get(coord);
            if (type == TileType.DESERT) {
                tiles.add(new DesertTile(coord));
            } else {
                tiles.add(new LandTile(coord, type, numberAssignment.get(coord)));
            }
        }

        // 4. Add Ports and Sea (Your existing logic)
        List<PortType> portQueue = new ArrayList<>(portTiles);
        for (Hex coord : PORT_COORDINATES) {
            tiles.add(new PortTile(coord, portQueue.removeFirst(), 1));
        }
        for (Hex coord : SEA_COORDINATES) {
            tiles.add(new SeaTile(coord));
        }

        return new Board(tiles);
    }

    private boolean backtrackNumbers(int index, List<Hex> hexes, List<Integer> pool, Map<Hex, Integer> assignment) {
        if (index == hexes.size()) return true;

        Hex currentHex = hexes.get(index);

        for (int i = 0; i < pool.size(); i++) {
            Integer num = pool.get(i);

            if (isRedNumberConstraintValid(currentHex, num, assignment)) {
                assignment.put(currentHex, num);

                // Optimization: Don't create whole new list objects, just remove and re-add
                pool.remove(i);
                if (backtrackNumbers(index + 1, hexes, pool, assignment)) return true;

                // Backtrack
                pool.add(i, num);
                assignment.remove(currentHex);
            }
        }
        return false;
    }

    private boolean isRedNumberConstraintValid(Hex hex, int num, Map<Hex, Integer> assignment) {
        if (num != 6 && num != 8) return true;

        for (Map.Entry<Hex, Integer> entry : assignment.entrySet()) {
            int otherNum = entry.getValue();
            if ((otherNum == 6 || otherNum == 8) && areNeighbors(hex, entry.getKey())) {
                return false;
            }
        }
        return true;
    }

    private boolean areNeighbors(Hex a, Hex b) {
        return (Math.abs(a.q() - b.q()) + Math.abs(a.r() - b.r()) + Math.abs(a.s() - b.s())) / 2 == 1;
    }
}