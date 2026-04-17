import type {Vertex} from "@/game/utils/HexGeometry/Vertex.ts";
import {PieceType, type PlacedPiece, type PlacementState} from "@/game/core/types.ts";
import type {Edge} from "@/game/utils/HexGeometry/Edge.ts";
import {hex, type Hex} from "@/game/utils/HexGeometry/Hex.ts";


export class PlacementMap {
    private vertices: Map<string, PlacedPiece> = new Map();
    private edges:    Map<string, PlacedPiece> = new Map();

    // ─── Mutations ────────────────────────────────────────────────────

    placeSettlement(vertex: Vertex, playerId: string) {
        this.vertices.set(this.vertexKey(vertex), { playerId, pieceType: PieceType.Settlement });
    }

    placeCity(vertex: Vertex, playerId: string) {
        this.vertices.set(this.vertexKey(vertex), { playerId, pieceType: PieceType.City});
    }

    placeRoad(edge: Edge, playerId: string) {
        this.edges.set(this.edgeKey(edge), { playerId, pieceType: PieceType.Road });
    }

    clear() {
        this.vertices.clear();
        this.edges.clear();
    }

    // ─── Queries used by BuildSystem ─────────────────────────────────

    isVertexOccupied(vertex: Vertex): boolean {
        return this.vertices.has(this.vertexKey(vertex));
    }

    isEdgeOccupied(edge: Edge): boolean {
        return this.edges.has(this.edgeKey(edge));
    }

    hasOwnSettlement(vertex: Vertex, playerId: string): boolean {
        const piece = this.vertices.get(this.vertexKey(vertex));
        return piece?.playerId === playerId && piece?.pieceType === PieceType.Settlement;
    }

    hasAdjacentRoad(vertex: Vertex, playerId: string): boolean {
        // A vertex touches edges formed by each pair of its hexes
        return this.getAdjacentEdges(vertex)
            .some(edge => {
                const piece = this.edges.get(this.edgeKey(edge));
                return piece?.playerId === playerId;
            });
    }

    hasAdjacentRoadOrSettlement(edge: Edge, playerId: string): boolean {
        // An edge touches 2 vertices — one at each endpoint
        return this.getEdgeVertices(edge)
            .some(vertex => {
                const piece = this.vertices.get(this.vertexKey(vertex));
                if (piece?.playerId === playerId) return true;

                // Also check for roads connected at this vertex
                return this.hasAdjacentRoad(vertex, playerId);
            });
    }

    respectsDistanceRule(vertex: Vertex): boolean {
        // No settlement within 2 edges of this vertex
        return !this.getAdjacentVertices(vertex)
            .some(v => this.vertices.has(this.vertexKey(v)));
    }

    // ─── State for renderer ───────────────────────────────────────────

    getState(): PlacementState {
        return {
            vertices: Array.from(this.vertices.entries()).map(([, piece], i) => ({
                vertex: this.vertexFromKey(Array.from(this.vertices.keys())[i]),
                piece,
            })),
            edges: Array.from(this.edges.entries()).map(([, piece], i) => ({
                edge:  this.edgeFromKey(Array.from(this.edges.keys())[i]),
                piece,
            })),
        };
    }

    // ─── Private — adjacency ──────────────────────────────────────────

    private getEdgeVertices(edge: Edge): Vertex[] {
        const [a, b] = edge.hexes;

        // Using the renamed utility functions:
        const aNeighbours = hex.neighbors(a).filter(h =>
            !hex.equals(h, b) && hex.areAdjacent(h, b)
        );

        return aNeighbours.map(n => ({
            hexes: [a, b, n] as [Hex, Hex, Hex]
        }));
    }

    private getAdjacentVertices(vertex: Vertex): Vertex[] {
        const [a, b, c] = vertex.hexes;

        // Using the renamed utility functions:
        const edgeNeighbours = (h1: Hex, h2: Hex) =>
            hex.neighbors(h1).filter(h =>
                !hex.equals(h, h2) && hex.areAdjacent(h, h2)
            );

        return [
            ...edgeNeighbours(a, b).map(n => ({ hexes: [a, b, n] as [Hex, Hex, Hex] })),
            ...edgeNeighbours(b, c).map(n => ({ hexes: [b, c, n] as [Hex, Hex, Hex] })),
            ...edgeNeighbours(a, c).map(n => ({ hexes: [a, c, n] as [Hex, Hex, Hex] })),
        ];
    }

    private getAdjacentEdges(vertex: Vertex): Edge[] {
        // A vertex is the intersection of exactly 3 hexes (a, b, and c).
        // The 3 edges radiating from this vertex are the boundaries between those specific hexes.
        const [a, b, c] = vertex.hexes;

        return [
            { hexes: [a, b] as [Hex, Hex] },
            { hexes: [b, c] as [Hex, Hex] },
            { hexes: [a, c] as [Hex, Hex] },
        ];
    }

    // ─── Private — keys ───────────────────────────────────────────────

    private vertexKey(vertex: Vertex): string {
        // Much cleaner using hex.toString!
        return vertex.hexes
            .map(hex.toString)
            .sort()
            .join('|');
    }

    private edgeKey(edge: Edge): string {
        return edge.hexes
            .map(hex.toString)
            .sort()
            .join('|');
    }

    private vertexFromKey(key: string): Vertex {
        const hexes = key.split('|').map(hex.fromString);
        return { hexes: hexes as [Hex, Hex, Hex] };
    }

    private edgeFromKey(key: string): Edge {
        const hexes = key.split('|').map(hex.fromString);
        return { hexes: hexes as [Hex, Hex] };
    }
}