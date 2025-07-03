import type {Layout} from "../hexagon/Layout.ts";
import type {Terrain} from "./Terrain.ts";
import type {Road} from "./Road.ts";

export class Board {
    public map: Map<string,Terrain>;
    public roads: Map<string,Road>;
    public layout: Layout;
    public canvas: HTMLCanvasElement;

    constructor(map: Map<string,Terrain>, roads: Map<string, Road>, layout: Layout, canvas: HTMLCanvasElement) {
        this.map = map;
        this.roads = roads;
        this.layout = layout;
        this.canvas = canvas;
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        //Start by drawing the map.
        for (const [, value] of this.map) {
            ctx.fillStyle = value.styling();
            ctx.fill(value.hex.path2d(this.layout));
        }

        //Drawing roads.
        for (const [, value] of this.roads) {
            ctx.fillStyle = value.styling();
            ctx.fill(value.edge.path2d(this.layout));
        }

    }
    //TBD
}