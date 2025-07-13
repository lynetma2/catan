import {Vertex} from "../hexagon/Vertex.ts";

export class Building {
    public vertex: Vertex;
    public player: number;
    public kind: string;
    public static SETTLEMENT: string = "SETTLEMENT";
    public static CITY: string = "CITY";

    constructor(vertex: Vertex, player: number, kind: string) {
        this.vertex = vertex;
        this.player = player;
        this.kind = kind;
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