import type {Board, Building, Edge, Hex, Player, Road, Tile, Vertex} from "@/game/model/types.ts";
import {BuildingType, EdgeDirection, ResourceType, TileKind, VertexDirection} from "@/game/model/enums.ts";
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
        const key = KeyService.vertexToKey(vertex);
        if (board.buildings.has(key)) {
            return board.buildings.get(key)?.type == BuildingType.Settlement;
        }
        return false;
    }

    public static hasRobber(board: Board, hex: Hex): boolean {
        return KeyService.hexToKey(board.robber) === KeyService.hexToKey(hex);
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

    public static getValidSettlementVertices(board: Board, playerId: string, checkConnection: boolean = true): Vertex[] {
        const candidateVertices = new Map<string, Vertex>();

        // 1. Find all vertices connected to player's roads

        if (checkConnection) {
            for (const road of board.roads.values()) {
                if (road.playerName === playerId) {
                    const vertices = this.getEdgeVertices(road.edge);
                    vertices.forEach(v => candidateVertices.set(KeyService.vertexToKey(v), v));
                }
            }
        } else {
            // 1.b Find all the vertices on the board (from tiles)
            for (const tile of board.tiles.values()) {
                const vertices = this.getHexVertices(tile.hex);
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

    public static getResourcesForVertex(board: Board, vertex: Vertex): Record<ResourceType, number> {
        const resources: Record<string, number> = {};
        
        // A brute-force check against all tiles is fast enough (19 tiles)
        // and safer than complex coordinate math without a strict grid system doc.
        board.tiles.forEach(tile => {
            if (tile.tileKind === TileKind.ResourceTile && tile.resourceType) {
                if (this.isVertexOnHex(vertex, tile.hex)) {
                    resources[tile.resourceType] = (resources[tile.resourceType] || 0) + 1;
                }
            }
        });
        
        return resources as Record<ResourceType, number>;
    }

    public static putBuilding(board: Board, building: Building): void {
        board.buildings.set(KeyService.vertexToKey(building.vertex), building);
    }

    public static putRoad(board: Board, road: Road): void {
        board.roads.set(KeyService.edgeToKey(road.edge), road);
    }

    public static moveRobber(board: Board, hex: Hex): void {
        board.robber = hex;
    }

    public static canPlaceRoad(board: Board, edge: Edge, playerId: string): boolean {
        if (this.hasRoad(board, edge)) return false;

        const vertices = this.getEdgeVertices(edge);
        for (const v of vertices) {
            // Check for own building
            if (this.hasBuilding(board, v)) {
                const building = board.buildings.get(KeyService.vertexToKey(v));
                if (building?.playerName === playerId) return true;
            }

            // Check for own connected road
            const adjacentEdges = this.getAdjacentEdges(v);
            for (const adj of adjacentEdges) {
                if (KeyService.edgeToKey(adj) === KeyService.edgeToKey(edge)) continue;

                if (this.hasRoad(board, adj)) {
                    const road = board.roads.get(KeyService.edgeToKey(adj));
                    if (road?.playerName === playerId) return true;
                }
            }
        }
        return false;
    }

    public static canPlaceSettlement(board: Board, vertex: Vertex, playerId: string, checkConnection: boolean = true): boolean {
        if (this.hasBuilding(board, vertex)) return false;

        const adjacentEdges = this.getAdjacentEdges(vertex);
        // Distance rule
        for (const edge of adjacentEdges) {
            const neighbors = this.getEdgeVertices(edge);
            for (const n of neighbors) {
                if (this.hasBuilding(board, n)) return false;
            }
        }

        // Connection rule (must connect to own road)
        if (checkConnection) {
            for (const edge of adjacentEdges) {
                if (this.hasRoad(board, edge)) {
                    const road = board.roads.get(KeyService.edgeToKey(edge));
                    if (road?.playerName === playerId) return true;
                }
            }
            return false;
        }
        return true;
    }

    public static canPlaceCity(board: Board, vertex: Vertex, playerId: string): boolean {
        const key = KeyService.vertexToKey(vertex);
        const building = board.buildings.get(key);
        if (!building) return false;
        return building.type === BuildingType.Settlement && building.playerName === playerId;
    }

    private static isVertexOnHex(vertex: Vertex, hex: Hex): boolean {
        // Check if the vertex coordinate matches any of the 6 corners of the hex
        // Based on the coordinate system implied by getEdgeVertices:
        // East Vertex of (q,r)
        if (vertex.q === hex.q && vertex.r === hex.r && vertex.direction === VertexDirection.East) return true;
        // West Vertex of (q,r)
        if (vertex.q === hex.q && vertex.r === hex.r && vertex.direction === VertexDirection.West) return true;
        
        // Neighbors' vertices that touch this hex:
        // Top-Right: West of (q+1, r-1)
        if (vertex.q === hex.q + 1 && vertex.r === hex.r - 1 && vertex.direction === VertexDirection.West) return true;
        // Bottom-Right: West of (q+1, r)
        if (vertex.q === hex.q + 1 && vertex.r === hex.r && vertex.direction === VertexDirection.West) return true;
        // Bottom-Left: East of (q-1, r+1)
        if (vertex.q === hex.q - 1 && vertex.r === hex.r + 1 && vertex.direction === VertexDirection.East) return true;
        // Top-Left: East of (q-1, r)
        if (vertex.q === hex.q - 1 && vertex.r === hex.r && vertex.direction === VertexDirection.East) return true;

        return false;
    }

    private static getHexVertices(hex: Hex): Vertex[] {
        return [
            {q: hex.q, r: hex.r, direction: VertexDirection.East},
            {q: hex.q, r: hex.r, direction: VertexDirection.West},
            {q: hex.q+1, r: hex.r-1, direction: VertexDirection.West},
            {q: hex.q+1, r: hex.r, direction: VertexDirection.West},
            {q: hex.q-1, r: hex.r+1, direction: VertexDirection.East},
            {q: hex.q-1, r: hex.r, direction: VertexDirection.East}
        ]
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