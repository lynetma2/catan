/**
 * A cube coordinate representing a hexagonal tile.
 * The constraint (q + r + s === 0) must always be maintained.
 */
export interface Hex {
    /** Column coordinate */
    q: number;

    /** Row coordinate */
    r: number;

    /** Intersecting coordinate */
    s: number;
}

/**
 * Internal helper to instantiate Hex objects and safely normalize -0 to +0.
 * This guarantees no -0 values ever leak out of the math functions.
 */
const makeHex = (q: number, r: number, s: number): Hex => ({
    q: q === 0 ? 0 : q,
    r: r === 0 ? 0 : r,
    s: s === 0 ? 0 : s
});

/**
 * Utility functions for working with Hex coordinates.
 *
 * All operations are immutable — they return new Hex objects
 * and never mutate the input coordinates.
 */
export const hex = {
    /**
     * Creates a new Hex and validates the cube coordinate constraint.
     * @throws If q + r + s !== 0
     */
    create: (q: number, r: number, s: number): Hex => {
        if (Math.round(q + r + s) !== 0) {
            throw new Error("q + r + s must be 0");
        }
        return makeHex(q, r, s);
    },

    /**
     * Adds two hex coordinates together.
     */
    add: (a: Hex, b: Hex): Hex =>
        makeHex(a.q + b.q, a.r + b.r, a.s + b.s),

    /**
     * Subtracts hex b from hex a.
     */
    subtract: (a: Hex, b: Hex): Hex =>
        makeHex(a.q - b.q, a.r - b.r, a.s - b.s),

    /**
     * Scales a hex coordinate by a scalar value.
     */
    scale: (h: Hex, k: number): Hex =>
        makeHex(h.q * k, h.r * k, h.s * k),

    /**
     * Rotates a hex coordinate 60 degrees to the left (counter-clockwise).
     */
    rotateLeft: (h: Hex): Hex =>
        makeHex(-h.s, -h.q, -h.r),

    /**
     * Rotates a hex coordinate 60 degrees to the right (clockwise).
     */
    rotateRight: (h: Hex): Hex =>
        makeHex(-h.r, -h.s, -h.q),

    /** Pre-calculated standard directional vectors (0-5) */
    directions: [
        { q: 1, r: 0, s: -1 }, { q: 1, r: -1, s: 0 }, { q: 0, r: -1, s: 1 },
        { q: -1, r: 0, s: 1 }, { q: -1, r: 1, s: 0 }, { q: 0, r: 1, s: -1 }
    ] as Hex[],

    /**
     * Returns the unit vector for a given direction (0-5).
     */
    direction: (dir: number): Hex =>
        hex.directions[dir],

    /**
     * Returns the neighboring hex in a given direction.
     */
    neighbor: (h: Hex, dir: number): Hex =>
        hex.add(h, hex.direction(dir)),

    /** Pre-calculated diagonal directional vectors (0-5) */
    diagonals: [
        { q: 2, r: -1, s: -1 }, { q: 1, r: -2, s: 1 }, { q: -1, r: -1, s: 2 },
        { q: -2, r: 1, s: 1 }, { q: -1, r: 2, s: -1 }, { q: 1, r: 1, s: -2 }
    ] as Hex[],

    /**
     * Returns the diagonal neighboring hex in a given direction.
     */
    diagonalNeighbor: (h: Hex, dir: number): Hex =>
        hex.add(h, hex.diagonals[dir]),

    /**
     * Computes the length (distance from the origin 0,0,0) of a hex.
     */
    len: (h: Hex): number =>
        (Math.abs(h.q) + Math.abs(h.r) + Math.abs(h.s)) / 2,

    /**
     * Computes the distance in hex steps between two hexes.
     */
    distance: (a: Hex, b: Hex): number =>
        hex.len(hex.subtract(a, b)),

    /**
     * Rounds fractional hex coordinates to the nearest valid integer hex.
     */
    round: (h: Hex): Hex => {
        let qi = Math.round(h.q);
        let ri = Math.round(h.r);
        let si = Math.round(h.s);

        const q_diff = Math.abs(qi - h.q);
        const r_diff = Math.abs(ri - h.r);
        const s_diff = Math.abs(si - h.s);

        if (q_diff > r_diff && q_diff > s_diff) {
            qi = -ri - si;
        } else if (r_diff > s_diff) {
            ri = -qi - si;
        } else {
            si = -qi - ri;
        }

        return makeHex(qi, ri, si);
    },

    /**
     * Performs linear interpolation between two hexes.
     */
    lerp: (a: Hex, b: Hex, t: number): Hex =>
        makeHex(
            a.q * (1.0 - t) + b.q * t,
            a.r * (1.0 - t) + b.r * t,
            a.s * (1.0 - t) + b.s * t
        ),

    /**
     * Draws a line between two hexes and returns all hexes intersected.
     */
    linedraw: (a: Hex, b: Hex): Hex[] => {
        const N = hex.distance(a, b);

        // Nudge to prevent lines from perfectly overlapping hex boundaries (avoids zig-zags)
        const a_nudge = makeHex(a.q + 1e-06, a.r + 1e-06, a.s - 2e-06);
        const b_nudge = makeHex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);

        const results: Hex[] = [];
        const step = 1.0 / Math.max(N, 1);

        for (let i = 0; i <= N; i++) {
            results.push(hex.round(hex.lerp(a_nudge, b_nudge, step * i)));
        }

        return results;
    },

    neighbors: (h: Hex) => {
        return hex.directions.map((_, dir) => hex.neighbor(h, dir));
    },

    areAdjacent: (a: Hex, b: Hex) => hex.distance(a, b) === 1,

    equals: (a: Hex, b: Hex) => a.q === b.q && a.r === b.r,

    /** Serializes a Hex to a string (e.g., "0,1,-1") for map keys */
    toString: (h: Hex): string => `${h.q},${h.r},${h.s}`,

    /** Deserializes a string back into a Hex object */
    fromString: (str: string): Hex => {
        const [q, r, s] = str.split(',').map(Number);
        return makeHex(q, r, s);
    }
};