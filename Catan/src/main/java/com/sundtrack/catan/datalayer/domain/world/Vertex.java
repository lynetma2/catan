package com.sundtrack.catan.datalayer.domain.world;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public record Vertex(List<Hex> hexes) {

    public static Vertex of(Hex a, Hex b, Hex c) {
        List<Hex> sorted = Stream.of(a, b, c)
                .sorted(Comparator.comparingInt(Hex::q)
                        .thenComparingInt(Hex::r)
                        .thenComparingInt(Hex::s))
                .toList();
        return new Vertex(sorted);
    }

    public static Vertex of(int q, int r, int dir1, int dir2) {
        Hex center = Hex.fromQR(q, r);
        return of(center, center.neighbor(dir1), center.neighbor(dir2));
    }

    public Vertex {
        if (hexes == null || hexes.size() != 3) {
            throw new IllegalArgumentException("A vertex MUST consist of exactly 3 hexes.");
        }
        // Defensive copy to ensure the list cannot be modified from outside
        hexes = List.copyOf(hexes);
    }
}
