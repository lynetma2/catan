import type {Layout} from "../hexagon/Layout.ts";
import type {Terrain} from "./Terrain.ts";

export class Board {
    public map: Map<string,Terrain>;
    public layout: Layout;
    public canvas: HTMLCanvasElement;

    constructor(map: Map<string,Terrain>, layout: Layout, canvas: HTMLCanvasElement) {
        this.map = map;
        this.layout = layout;
        this.canvas = canvas;
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        //Start by drawing the map.
        for (const [key, value] of this.map) {
            ctx.fillStyle = value.styling();
            ctx.fill(value.hex.path2d(this.layout));
        }
    }
    //TBD
}