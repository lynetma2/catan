import type {Layout} from "./Layout.ts";
import {Vertex} from "@/game/hexagon/Vertex.ts";

export class Edge {
    public q:number;
    public r:number;
    public s:number;
    public direction: string;
    public static NORTH_DIRECTION: string = "NORTH";
    public static EAST_DIRECTION: string = "EAST";
    public static WEST_DIRECTION: string = "WEST";

    constructor(q: number, r: number, s:number, direction: string) {
        this.q = q;
        this.r = r;
        this.s = s;
        this.direction = direction;
    }

    public static fromKey(key: string) {
        const matches = key.matchAll(/q(-?\d+)r(-?\d+)s(-?\d+)d(NORTH|WEST|EAST)/gm);
        if (matches) {
            //Don't know how to not loop.
            for (const match of matches) {
                return new Edge(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), match[4]);
            }
        }
    }

    public path2d(layout: Layout): Path2D {
        const polygon = layout.edgeToPixelVertices(this);
        const edge = new Path2D();
        edge.moveTo(polygon[0].x, polygon[0].y);
        edge.lineTo(polygon[1].x, polygon[1].y);
        return edge
    }

    public toKey() {
        return `q${this.q}r${this.r}s${this.s}d${this.direction}`;
    }

    public edgeNeighbours() {
        const neighbours: Edge[] = [];
        switch (this.direction) {
            case Edge.EAST_DIRECTION:
                neighbours[0] = new Edge(this.q,this.r,this.s, Edge.NORTH_DIRECTION);
                neighbours[1] = new Edge(this.q+1,this.r-1,this.s, Edge.WEST_DIRECTION);
                neighbours[2] = new Edge(this.q+1,this.r,this.s-1, Edge.NORTH_DIRECTION);
                neighbours[3] = new Edge(this.q+1,this.r, this.s-1, Edge.WEST_DIRECTION);
                break;
            case Edge.WEST_DIRECTION:
                neighbours[0] = new Edge(this.q,this.r, this.s, Edge.NORTH_DIRECTION);
                neighbours[1] = new Edge(this.q-1,this.r,this.s+1, Edge.EAST_DIRECTION);
                neighbours[2] = new Edge(this.q-1,this.r+1,this.s,Edge.NORTH_DIRECTION);
                neighbours[3] = new Edge(this.q-1,this.r+1,this.s, Edge.EAST_DIRECTION);
                break;
            case Edge.NORTH_DIRECTION:
                neighbours[0] = new Edge(this.q,this.r, this.s, Edge.EAST_DIRECTION);
                neighbours[1] = new Edge(this.q,this.r,this.s, Edge.WEST_DIRECTION);
                neighbours[2] = new Edge(this.q-1,this.r,this.s+1, Edge.EAST_DIRECTION);
                neighbours[3] = new Edge(this.q+1,this.r-1,this.s, Edge.WEST_DIRECTION);
                break;
        }
        return neighbours;
    }

    public vertexNeighbours() {
        const neighbours: Vertex[] = [];
        switch (this.direction) {
            case Edge.NORTH_DIRECTION:
                neighbours[0] = new Vertex(this.q,this.r,this.s, Vertex.WEST_DIRECTION);
                neighbours[1] = new Vertex(this.q,this.r,this.s, Vertex.EAST_DIRECTION);
                neighbours[2] = new Vertex(this.q,this.r-1,this.s+1, Vertex.WEST_DIRECTION);
                neighbours[3] = new Vertex(this.q,this.r-1,this.s+1, Vertex.EAST_DIRECTION);
                break;
            case Edge.EAST_DIRECTION:
                neighbours[0] = new Vertex(this.q+2,this.r-1,this.s-1, Vertex.WEST_DIRECTION);
                neighbours[1] = new Vertex(this.q+1,this.r,this.s-1, Vertex.WEST_DIRECTION);
                neighbours[2] = new Vertex(this.q,this.r-1,this.s+1, Vertex.EAST_DIRECTION);
                neighbours[3] = new Vertex(this.q-1,this.r,this.s+1, Vertex.EAST_DIRECTION);
                break;
            case Edge.WEST_DIRECTION:
                neighbours[0] = new Vertex(this.q,this.r-1,this.s+1, Vertex.WEST_DIRECTION);
                neighbours[1] = new Vertex(this.q+1,this.r-1,this.s, Vertex.WEST_DIRECTION);
                neighbours[2] = new Vertex(this.q-2,this.r+1,this.s+1, Vertex.EAST_DIRECTION);
                neighbours[3] = new Vertex(this.q-1,this.r+1,this.s, Vertex.EAST_DIRECTION);
                break;
        }
        return neighbours;
    }

    public edgeVertices() {
        const neighbours: Vertex[] = [];
        switch (this.direction) {
            case Edge.NORTH_DIRECTION:
                neighbours[0] = new Vertex(this.q+1,this.r-1,this.s, Vertex.WEST_DIRECTION);
                neighbours[1] = new Vertex(this.q-1,this.r,this.s+1, Vertex.EAST_DIRECTION);
                break;
            case Edge.EAST_DIRECTION:
                neighbours[0] = new Vertex(this.q,this.r,this.s, Vertex.EAST_DIRECTION);
                neighbours[1] = new Vertex(this.q+1,this.r-1,this.s, Vertex.WEST_DIRECTION);
                break;
            case Edge.WEST_DIRECTION:
                neighbours[0] = new Vertex(this.q,this.r,this.s, Vertex.WEST_DIRECTION);
                neighbours[1] = new Vertex(this.q-1,this.r,this.s+1, Vertex.WEST_DIRECTION);
                break;
        }
        return neighbours;
    }
}