import { type Hex, hex } from './Hex';

/**
 * A vertex is the corner point shared by exactly 3 hexagonal tiles.
 * Identified by its 3 surrounding hexes in sorted order.
 */
export interface Vertex {
    hexes: [Hex, Hex, Hex];
}

/**
 * Utility functions for working with Vertex coordinates.
 *
 * All operations are immutable — they return new Vertex objects
 * and never mutate the input.
 */
export const vertex = {
    /**
     * Creates a Vertex from 3 hexes.
     * Sorts them so the same corner always produces the same Vertex,
     * regardless of the order the hexes were provided.
     * @throws If the 3 hexes do not share a common corner.
     */
    create: (a: Hex, b: Hex, c: Hex): Vertex => {
        if (!vertex.isValid(a, b, c)) {
            throw new Error('The 3 hexes do not share a common vertex');
        }
        return { hexes: vertex.sort([a, b, c]) as [Hex, Hex, Hex] };
    },

    /**
     * Checks whether 3 hexes actually share a common corner.
     * In cube coordinates, 3 hexes share a vertex if each pair
     * is adjacent (distance === 1) and they form a ring.
     */
    isValid: (a: Hex, b: Hex, c: Hex): boolean => {
        return hex.distance(a, b) === 1
            && hex.distance(b, c) === 1
            && hex.distance(a, c) === 1;
    },

    /**
     * Returns all 6 vertices surrounding a hex.
     * Each vertex is shared by the hex and 2 of its neighbours.
     */
    ofHex: (h: Hex): Vertex[] => {
        return hex.directions.map((_, dir) => {
            const n1 = hex.neighbor(h, dir);
            const n2 = hex.neighbor(h, (dir + 1) % 6);
            return { hexes: vertex.sort([h, n1, n2]) as [Hex, Hex, Hex] };
        });
    },

    /**
     * Returns the 3 vertices adjacent to this vertex
     * (connected by an edge).
     */
    neighbours: (v: Vertex): Vertex[] => {
        const [a, b, c] = v.hexes;
        // Each adjacent vertex shares exactly 2 of the 3 hexes
        // and adds one new hex neighbour
        const adjacentTo = (h1: Hex, h2: Hex): Vertex[] =>
            hex.directions
                .map(d => hex.add(h1, d))
                .filter(n =>
                    !vertex.hexEquals(n, h1) &&
                    !vertex.hexEquals(n, h2) &&
                    !vertex.hexEquals(n, c) &&
                    hex.distance(n, h2) === 1
                )
                .map(n => ({
                    hexes: vertex.sort([h1, h2, n]) as [Hex, Hex, Hex]
                }));

        return [
            ...adjacentTo(a, b),
            ...adjacentTo(b, c),
            ...adjacentTo(a, c),
        ];
    },

    /**
     * Returns the 3 edges emanating from this vertex.
     */
    edges: (v: Vertex): import('./Edge').Edge[] => {
        const [a, b, c] = v.hexes;
        return [
            { hexes: edgeSort([a, b]) as [Hex, Hex] },
            { hexes: edgeSort([b, c]) as [Hex, Hex] },
            { hexes: edgeSort([a, c]) as [Hex, Hex] },
        ];
    },

    /**
     * Checks whether two vertices are the same corner.
     */
    equals: (a: Vertex, b: Vertex): boolean => {
        return a.hexes.every((h, i) => vertex.hexEquals(h, b.hexes[i]));
    },

    /**
     * Converts a vertex to a stable string key.
     * Useful for Map lookups.
     */
    toKey: (v: Vertex): string => {
        return v.hexes
            .map(h => `${h.q},${h.r},${h.s}`)
            .join('|');
    },

    // ─── Internal helpers ─────────────────────────────────────────────

    hexEquals: (a: Hex, b: Hex): boolean =>
        a.q === b.q && a.r === b.r && a.s === b.s,

    sort: (hexes: Hex[]): Hex[] =>
        [...hexes].sort((a, b) =>
            a.q !== b.q ? a.q - b.q :
                a.r !== b.r ? a.r - b.r :
                    a.s - b.s
        ),
};

// Needed by vertex.edges — extracted to avoid circular import issues
const edgeSort = (hexes: Hex[]): Hex[] =>
    [...hexes].sort((a, b) =>
        a.q !== b.q ? a.q - b.q :
            a.r !== b.r ? a.r - b.r :
                a.s - b.s
    );