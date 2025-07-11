import {Edge} from "./hexagon/Edge.ts";

export class Road {
    public edge: Edge;
    public player: number;

    constructor(edge: Edge, player: number) {
        this.edge = edge;
        this.player = player;
    }

    public styling() {
        switch (this.player) {
            case 0:
                return "orange"
            case 1:
                return "blue"
            case 2:
                return "green"
            case 3:
                return "yellow"
            default:
                return "#000"
        }
    }
    //TBD
}