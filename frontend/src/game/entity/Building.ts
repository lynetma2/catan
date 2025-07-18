import {Vertex} from "../hexagon/Vertex.ts";

export class Building {
    public vertex: Vertex;
    public player: string;
    public kind: string;
    public static SETTLEMENT: string = "SETTLEMENT";
    public static CITY: string = "CITY";

    constructor(vertex: Vertex, player: string, kind: string) {
        this.vertex = vertex;
        this.player = player;
        this.kind = kind;
    }

    //TBD
}