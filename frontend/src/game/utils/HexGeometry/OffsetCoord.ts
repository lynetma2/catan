// Assuming Hex is imported:
// import { Hex } from './hex-math';

import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {DoubledCoord} from "@/game/utils/HexGeometry/DoubledCoord.ts";

/**
 * A standard 2D array coordinate (column/row).
 * Used for mapping hexes to rectangular arrays or tilemaps.
 */
export interface OffsetCoord {
    col: number;
    row: number;
}

/**
 * Utility functions for Offset Coordinates.
 * * "qoffset" refers to offsetting columns (flat-topped hexes).
 * "roffset" refers to offsetting rows (pointy-topped hexes).
 */
export const offsetCoord = {
    /** Pushes odd rows/columns down/right */
    EVEN: 1,

    /** Pushes even rows/columns down/right */
    ODD: -1,

    /**
     * Creates an OffsetCoord.
     */
    create: (col: number, row: number): OffsetCoord => ({ col, row }),

    /**
     * Converts from a Cube coordinate to a column-offset (flat-topped) coordinate.
     */
    qoffsetFromCube: (offset: number, h: Hex): OffsetCoord => {
        if (offset !== offsetCoord.EVEN && offset !== offsetCoord.ODD) {
            throw new Error("offset must be EVEN (+1) or ODD (-1)");
        }
        const parity = h.q & 1;
        const col = h.q;
        const row = h.r + (h.q + offset * parity) / 2;
        return { col, row };
    },

    /**
     * Converts from a column-offset coordinate back to a Cube coordinate.
     */
    qoffsetToCube: (offset: number, h: OffsetCoord): Hex => {
        if (offset !== offsetCoord.EVEN && offset !== offsetCoord.ODD) {
            throw new Error("offset must be EVEN (+1) or ODD (-1)");
        }
        const parity = h.col & 1;
        const q = h.col;
        const r = h.row - (h.col + offset * parity) / 2;
        const s = -q - r;
        return { q, r, s };
    },

    /**
     * Converts from a Cube coordinate to a row-offset (pointy-topped) coordinate.
     */
    roffsetFromCube: (offset: number, h: Hex): OffsetCoord => {
        if (offset !== offsetCoord.EVEN && offset !== offsetCoord.ODD) {
            throw new Error("offset must be EVEN (+1) or ODD (-1)");
        }
        const parity = h.r & 1;
        const col = h.q + (h.r + offset * parity) / 2;
        const row = h.r;
        return { col, row };
    },

    /**
     * Converts from a row-offset coordinate back to a Cube coordinate.
     */
    roffsetToCube: (offset: number, h: OffsetCoord): Hex => {
        if (offset !== offsetCoord.EVEN && offset !== offsetCoord.ODD) {
            throw new Error("offset must be EVEN (+1) or ODD (-1)");
        }
        const parity = h.row & 1;
        const q = h.col - (h.row + offset * parity) / 2;
        const r = h.row;
        const s = -q - r;
        return { q, r, s };
    },

    /**
     * Converts from a Doubled coordinate to a column-offset coordinate.
     */
    qoffsetFromQdoubled: (offset: number, h: DoubledCoord): OffsetCoord => {
        const parity = h.col & 1;
        return {
            col: h.col,
            row: (h.row + offset * parity) / 2
        };
    },

    /**
     * Converts from a column-offset coordinate to a Doubled coordinate.
     */
    qoffsetToQdoubled: (offset: number, h: OffsetCoord): DoubledCoord => {
        const parity = h.col & 1;
        return {
            col: h.col,
            row: 2 * h.row - offset * parity
        };
    },

    /**
     * Converts from a Doubled coordinate to a row-offset coordinate.
     */
    roffsetFromRdoubled: (offset: number, h: DoubledCoord): OffsetCoord => {
        const parity = h.row & 1;
        return {
            col: (h.col + offset * parity) / 2,
            row: h.row
        };
    },

    /**
     * Converts from a row-offset coordinate to a Doubled coordinate.
     */
    roffsetToRdoubled: (offset: number, h: OffsetCoord): DoubledCoord => {
        const parity = h.row & 1;
        return {
            col: 2 * h.col - offset * parity,
            row: h.row
        };
    }
};