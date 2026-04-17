import { type Hex, hex } from './Hex';
import { type Vertex, vertex } from './Vertex';

/**
 * An edge is the boundary shared by exactly 2 hexagonal tiles.
 * Identified by its 2 surrounding hexes in sorted order.
 */
export interface Edge {
    hexes: [Hex, Hex];
}

/**
 * Utility functions for working with Edge coordinates.
 *
 * All operations are immutable — they return new Edge objects
 * and never mutate the input.
 */
export const edge = {
    /**
     * Creates an Edge from 2 hexes.
     * Sorts them so the same boundary always produces the same Edge,
     * regardless of the order the hexes were provided.
     * @throws If the 2 hexes are not adjacent.
     */
    create: (a: Hex, b: Hex): Edge => {
        if (!edge.isValid(a, b)) {
            throw new Error('The 2 hexes are not adjacent');
        }
        return { hexes: edge.sort([a, b]) as [Hex, Hex] };
    },

    /**
     * Checks whether 2 hexes actually share an edge.
     * In cube coordinates, two hexes are adjacent if their distance is 1.
     */
    isValid: (a: Hex, b: Hex): boolean => {
        return hex.distance(a, b) === 1;
    },

    /**
     * Returns all 6 edges surrounding a hex.
     */
    ofHex: (h: Hex): Edge[] => {
        return hex.directions.map((_, dir) => {
            const neighbour = hex.neighbor(h, dir);
            return { hexes: edge.sort([h, neighbour]) as [Hex, Hex] };
        });
    },

    /**
     * Returns the 2 vertices at each end of this edge.
     */
    vertices: (e: Edge): Vertex[] => {
        const [a, b] = e.hexes;

        // The two vertices of an edge are formed by the two hexes
        // plus each of their shared neighbours
        const sharedNeighbours = hex.directions
            .map(d => hex.add(a, d))
            .filter(n =>
                !vertex.hexEquals(n, a) &&
                !vertex.hexEquals(n, b) &&
                hex.distance(n, b) === 1
            );

        return sharedNeighbours.map(n => ({
            hexes: vertex.sort([a, b, n]) as [Hex, Hex, Hex]
        }));
    },

    /**
     * Returns the 4 edges adjacent to this edge
     * (edges that share a vertex with this edge, excluding itself).
     */
    neighbours: (e: Edge): Edge[] => {
        return edge.vertices(e)
            .flatMap(v => vertex.edges(v))
            .filter(other => !edge.equals(other, e));
    },

    /**
     * Checks whether two edges are the same boundary.
     */
    equals: (a: Edge, b: Edge): boolean => {
        return a.hexes.every((h, i) => vertex.hexEquals(h, b.hexes[i]));
    },

    /**
     * Converts an edge to a stable string key.
     * Useful for Map lookups.
     */
    toKey: (e: Edge): string => {
        return e.hexes
            .map(h => `${h.q},${h.r},${h.s}`)
            .join('|');
    },

    // ─── Internal helpers ─────────────────────────────────────────────

    sort: (hexes: Hex[]): Hex[] =>
        [...hexes].sort((a, b) =>
            a.q !== b.q ? a.q - b.q :
                a.r !== b.r ? a.r - b.r :
                    a.s - b.s
        ),
};