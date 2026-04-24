package com.sundtrack.catan.datalayer.domain.world;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public record Edge(List<Hex> hexes) {

    /**
     * Compact constructor to enforce the two-hex rule and immutability.
     */
    public Edge {
        if (hexes == null || hexes.size() != 2) {
            throw new IllegalArgumentException("An edge must be defined by exactly 2 hexes.");
        }
        // Ensure the internal list is unmodifiable
        hexes = List.copyOf(hexes);
    }

    /**
     * Strict Factory: Requires exactly two Hex objects.
     */
    public static Edge of(Hex a, Hex b) {
        List<Hex> sorted = Stream.of(a, b)
                .sorted(Comparator.comparingInt(Hex::q)
                        .thenComparingInt(Hex::r)
                        .thenComparingInt(Hex::s))
                .toList();
        return new Edge(sorted);
    }

    /**
     * Convenience Factory: Replicates the TypeScript 'e' logic.
     * Use this in your TestStateFactory for cleaner setup.
     */
    public static Edge of(int q, int r, int dir) {
        Hex center = Hex.fromQR(q, r);
        Hex neighbor = center.neighbor(dir);
        return of(center, neighbor);
    }
}
