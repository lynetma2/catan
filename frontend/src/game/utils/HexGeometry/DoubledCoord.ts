import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";

/**
 * A coordinate system where spacing is doubled to avoid floating point math
 * and odd/even row parity checks.
 */
export interface DoubledCoord {
    col: number;
    row: number;
}

/**
 * Utility functions for working with Doubled Coordinates.
 * * "qdoubled" is used for flat-topped hexes (columns are doubled).
 * * "rdoubled" is used for pointy-topped hexes (rows are doubled).
 */
export const doubledCoord = {
    /**
     * Creates a new DoubledCoord.
     */
    create: (col: number, row: number): DoubledCoord => ({ col, row }),

    /**
     * Converts from a Cube coordinate to a column-doubled (flat-topped) coordinate.
     */
    qdoubledFromCube: (h: Hex): DoubledCoord => {
        const col = h.q;
        const row = 2 * h.r + h.q;
        return { col, row };
    },

    /**
     * Converts from a column-doubled coordinate back to a Cube coordinate.
     */
    qdoubledToCube: (h: DoubledCoord): Hex => {
        const q = h.col;
        const r = (h.row - h.col) / 2;
        const s = -q - r;
        return { q, r, s };
    },

    /**
     * Converts from a Cube coordinate to a row-doubled (pointy-topped) coordinate.
     */
    rdoubledFromCube: (h: Hex): DoubledCoord => {
        const col = 2 * h.q + h.r;
        const row = h.r;
        return { col, row };
    },

    /**
     * Converts from a row-doubled coordinate back to a Cube coordinate.
     */
    rdoubledToCube: (h: DoubledCoord): Hex => {
        const q = (h.col - h.row) / 2;
        const r = h.row;
        const s = -q - r;
        return { q, r, s };
    }
};