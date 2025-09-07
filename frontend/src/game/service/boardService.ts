import type {Board, Building, Edge, Hex, Player, Road, Vertex} from "@/game/model/types.ts";
import {BuildingKind, EdgeDirection, VertexDirection} from "@/game/model/enums.ts";

export class BoardService {
    private board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    //Methods that might make sense.
    public hasBuilding(vertex: Vertex): boolean {
        return this.board.buildings.has(vertex.toKey());
    }

    public hasRoad(edge: Edge): boolean {
        return this.board.roads.has(edge.toKey());
    }

    public hasHouse(vertex: Vertex): boolean {
        if (this.board.buildings.has(vertex.toKey())) {
            return this.board.buildings.get(vertex.toKey())?.kind == BuildingKind.House;
        }
        return false;
    }

    public hasRobber(hex: Hex): boolean {
        return this.board.robber == hex;
    }

    public hasRoadConnectionTo(vertex: Vertex, player: Player): boolean {

    }

    public putBuilding(building: Building): void {
        this.board.buildings.set(building.vertex.toKey(), building);
    }

    public putRoad(road: Road): void {
        this.board.roads.set(road.edge.toKey(), road);
    }

    public moveRobber(hex: Hex): void {
        this.board.robber = hex;
    }

    private getAdjacentEdges(vertex: Vertex): Edge[] {
        const edges: Edge[] = [];
        let vq = vertex.q;
        let vr = vertex.r;
        if (vertex.direction == VertexDirection.West) {
            edges.push({q: vq, r: vr, direction: EdgeDirection.West})
        }
    }

    private getAdjacentVertices(edge: Edge): Vertex[] {

    }
}