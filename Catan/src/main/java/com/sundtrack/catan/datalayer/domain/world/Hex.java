package com.sundtrack.catan.datalayer.domain.world;

public record Hex(int q, int r, int s) {
    public Hex {
        if (q + r + s != 0) {
            throw new IllegalArgumentException("Hex coordinates must sum to zero: q=" + q + ", r=" + r + ", s=" + s);
        }
    }

    public static Hex fromQR(int q, int r) {
        return new Hex(q, r, -q - r);
    }

    // Directional offsets for neighbors (Catan standard)
    private static final int[][] DIRECTIONS = {
            {1, 0, -1}, {1, -1, 0}, {0, -1, 1},
            {-1, 0, 1}, {-1, 1, 0}, {0, 1, -1}
    };

    public Hex neighbor(int direction) {
        int[] d = DIRECTIONS[direction % 6];
        return new Hex(this.q + d[0], this.r + d[1], this.s + d[2]);
    }
}