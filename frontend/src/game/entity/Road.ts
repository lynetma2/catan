import {Edge} from "../hexagon/Edge.ts";

export class Road {
    public edge: Edge;
    public player: string;

    constructor(edge: Edge, player: string) {
        this.edge = edge;
        this.player = player;
    }

    public styling() {
        switch (this.player) {
            // case 0:
            //     return "orange"
            // case 1:
            //     return "blue"
            // case 2:
            //     return "green"
            // case 3:
            //     return "yellow"
            default:
                return "orange"
        }
    }

    public vertexNeighbours() {
        return this.edge.vertexNeighbours()
    }

    public edgeVertices() {
        return this.edge.edgeVertices()
    }
    //TBD
}