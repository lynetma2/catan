package com.sundtrack.catan.datalayer.domain.board;

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

    /**
     * Returns the two vertices (endpoints) that share this edge.
     * Each vertex is the intersection of the two edge hexes plus a third hex
     * that lies on one side of the edge.
     */
    public List<Vertex> getVertices() {
        Hex a = hexes.get(0);
        Hex b = hexes.get(1);

        // Determine which direction A → B corresponds to
        int dir = directionFromAToB(a, b);

        // The two third hexes are the neighbors of A on either side of the edge
        Hex third1 = a.neighbor((dir + 1) % 6);
        Hex third2 = a.neighbor((dir - 1 + 6) % 6);

        return List.of(
                Vertex.of(a, b, third1),
                Vertex.of(a, b, third2)
        );
    }

    /**
     * Checks if the given vertex is an endpoint of this edge.
     * A vertex is adjacent if its three hexes contain both of this edge's hexes.
     */
    public boolean isAdjacentTo(Vertex vertex) {
        return new java.util.HashSet<>(vertex.hexes()).containsAll(hexes);
    }

    /**
     * Helper to find the neighbour direction from a to b.
     * Assumes a and b are adjacent; returns the direction index (0-5).
     */
    private int directionFromAToB(Hex a, Hex b) {
        int dq = b.q() - a.q();
        int dr = b.r() - a.r();
        // Convert axial difference to direction (based on Hex.neighbor implementation)
        // Standard axial direction vectors:
        // 0: (+1, 0), 1: (+1, -1), 2: (0, -1), 3: (-1, 0), 4: (-1, +1), 5: (0, +1)
        if (dq == 1 && dr == 0) return 0;
        if (dq == 1 && dr == -1) return 1;
        if (dq == 0 && dr == -1) return 2;
        if (dq == -1 && dr == 0) return 3;
        if (dq == -1 && dr == 1) return 4;
        if (dq == 0 && dr == 1) return 5;
        throw new IllegalArgumentException("Hexes are not adjacent: " + a + ", " + b);
    }
}
