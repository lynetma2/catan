import type {Board, Building, Edge, Hex, Player, Road, Vertex} from "@/game/model/types.ts";
import {BuildingType, EdgeDirection, VertexDirection} from "@/game/model/enums.ts";
import {KeyService} from "@/game/utils/KeyService.ts";

export class BoardService {
    //Methods that might make sense.
    public static hasBuilding(board: Board, vertex: Vertex): boolean {
        return board.buildings.has(KeyService.vertexToKey(vertex));
    }

    public static hasRoad(board: Board, edge: Edge): boolean {
        return board.roads.has(KeyService.edgeToKey(edge));
    }

    public static hasHouse(board: Board, vertex: Vertex): boolean {
        if (board.buildings.has(KeyService.vertexToKey(vertex))) {
            return board.buildings.get(KeyService.vertexToKey(vertex))?.type == BuildingType.Settlement;
        }
        return false;
    }

    public static hasRobber(board: Board, hex: Hex): boolean {
        return board.robber == hex;
    }

    public static hasRoadConnectionTo(board: Board, vertex: Vertex, player: Player): boolean {
        // TODO: Implement for settlement placement validation
        return false;
    }

    public static getValidRoadEdges(board: Board, playerId: string): Edge[] {
        const validEdges = new Map<string, Edge>();

        // 1. Check edges around existing roads
        for (const road of board.roads.values()) {
            if (road.playerName === playerId) {
                const vertices = this.getEdgeVertices(road.edge);
                vertices.forEach(v => {
                    this.getAdjacentEdges(v).forEach(e => validEdges.set(KeyService.edgeToKey(e), e));
                });
            }
        }

        // 2. Check edges around existing buildings
        for (const building of board.buildings.values()) {
            if (building.playerName === playerId) {
                this.getAdjacentEdges(building.vertex).forEach(e => validEdges.set(KeyService.edgeToKey(e), e));
            }
        }

        // 3. Filter out occupied edges
        return Array.from(validEdges.values()).filter(e => !this.hasRoad(board, e));
    }

    public static getValidSettlementVertices(board: Board, playerId: string): Vertex[] {
        const candidateVertices = new Map<string, Vertex>();

        // 1. Find all vertices connected to player's roads
        for (const road of board.roads.values()) {
            if (road.playerName === playerId) {
                const vertices = this.getEdgeVertices(road.edge);
                vertices.forEach(v => candidateVertices.set(KeyService.vertexToKey(v), v));
            }
        }

        // 2. Filter by Distance Rule (no building on adjacent vertices) and Occupancy
        return Array.from(candidateVertices.values()).filter(v => {
            if (this.hasBuilding(board, v)) return false;

            const adjacentEdges = this.getAdjacentEdges(v);
            // Check all neighbors via adjacent edges
            return adjacentEdges.every(edge => {
                const neighbors = this.getEdgeVertices(edge);
                return neighbors.every(n => !this.hasBuilding(board, n));
            });
        });
    }

    public static getValidCityVertices(board: Board, playerId: string): Vertex[] {
        const validVertices: Vertex[] = [];
        for (const building of board.buildings.values()) {
            if (building.playerName === playerId && building.type === BuildingType.Settlement) {
                validVertices.push(building.vertex);
            }
        }
        return validVertices;
    }

    public static putBuilding(board: Board, building: Building): void {
        board.buildings.set(KeyService.vertexToKey(building.vertex), building);
    }

    public static putRoad(board: Board, road: Road): void {
        board.roads.set(road.edge.toKey(), road);
    }

    public static moveRobber(board: Board, hex: Hex): void {
        board.robber = hex;
    }

    private static getAdjacentEdges(vertex: Vertex): Edge[] {
        const edges: Edge[] = [];
        const vq = vertex.q;
        const vr = vertex.r;
        if (vertex.direction == VertexDirection.West) {
            edges.push({q: vq, r: vr, direction: EdgeDirection.West});
            edges.push({q: vq-1, r: vr+1, direction: EdgeDirection.North});
            edges.push({q: vq-1, r: vr+1, direction: EdgeDirection.East});
        } else {
            edges.push({q: vq, r: vr, direction: EdgeDirection.East});
            edges.push({q: vq+1, r: vr, direction: EdgeDirection.North});
            edges.push({q: vq+1, r: vr, direction: EdgeDirection.West});
        }
        return edges;
    }

    private static getEdgeVertices(edge: Edge): Vertex[] {
        const eq = edge.q;
        const er = edge.r;
        
        switch (edge.direction) {
            case EdgeDirection.East:
                return [
                    {q: eq, r: er, direction: VertexDirection.East},
                    {q: eq+1, r: er-1, direction: VertexDirection.West}
                ];
            case EdgeDirection.North:
                return [
                    {q: eq-1, r: er, direction: VertexDirection.East},
                    {q: eq+1, r: er-1, direction: VertexDirection.West}
                ];
            case EdgeDirection.West:
                return [
                    {q: eq, r: er, direction: VertexDirection.West},
                    {q: eq-1, r: er, direction: VertexDirection.East}
                ];
        }
    }
}