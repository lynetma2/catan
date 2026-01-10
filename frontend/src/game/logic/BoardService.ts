import type {Board, Building, Edge, Hex, Player, Road, Vertex} from "@/game/model/types.ts";
import {BuildingType, EdgeDirection, VertexDirection} from "@/game/model/enums.ts";
import {Edge} from "@/game/model/edge.ts";

export class BoardService {
    //Methods that might make sense.
    public static hasBuilding(board: Board, vertex: Vertex): boolean {
        return board.buildings.has(vertex.toKey());
    }

    public static hasRoad(board: Board, edge: Edge): boolean {
        return board.roads.has(edge.toKey());
    }

    public static hasHouse(board: Board, vertex: Vertex): boolean {
        if (board.buildings.has(vertex.toKey())) {
            return board.buildings.get(vertex.toKey())?.type == BuildingType.Settlement;
        }
        return false;
    }

    public static hasRobber(board: Board, hex: Hex): boolean {
        return board.robber == hex;
    }

    public static hasRoadConnectionTo(board: Board, vertex: Vertex, player: Player): boolean {

    }

    public static putBuilding(board: Board, building: Building): void {
        board.buildings.set(building.vertex.toKey(), building);
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
            edges.push(new Edge(EdgeDirection.West, vq, vr));
            edges.push(new Edge(EdgeDirection.North, vq-1, vr+1));
            edges.push(new Edge(EdgeDirection.East, vq-1, vr+1));
        } else {
            edges.push(new Edge(EdgeDirection.East, vq, vr));
            edges.push(new Edge(EdgeDirection.North, vq+1, vr));
            edges.push(new Edge(EdgeDirection.West, vq+1, vr));
        }
        return edges;
    }

    private static getEdgeVertices(edge: Edge): Vertex[] {
        const vertices: Vertex[] = [];
        const eq = edge.q;
        const er = edge.r;
    }
}