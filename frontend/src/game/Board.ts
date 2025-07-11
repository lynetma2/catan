import type {Layout} from "./hexagon/Layout.ts";
import type {Terrain} from "./Terrain.ts";
import type {Road} from "./Road.ts";
import {Building} from "./Building.ts";

export class Board {
    public map: Map<string,Terrain>;
    public roads: Map<string,Road>;
    public buildings: Map<string,Building>;
    public layout: Layout;
    public canvas: HTMLCanvasElement;

    constructor(map: Map<string,Terrain>, roads: Map<string, Road>, buildings: Map<string, Building>, layout: Layout, canvas: HTMLCanvasElement) {
        this.map = map;
        this.roads = roads;
        this.buildings = buildings;
        this.layout = layout;
        this.canvas = canvas;
    }

    public draw() {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        //Clearing the map
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Start by drawing the map.
        for (const [, value] of this.map) {
            ctx.fillStyle = value.styling();
            ctx.fill(value.hex.path2d(this.layout));

            //Cleanup
            ctx.fillStyle = "black";
        }

        //Drawing roads.
        for (const [, value] of this.roads) {
            ctx.strokeStyle = value.styling();
            ctx.lineWidth = this.layout.road_width;
            ctx.stroke(value.edge.path2d(this.layout));

            //Cleanup
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1;
        }

        //Drawing buildings
        for (const [, value] of this.buildings) {
            ctx.fillStyle = value.styling();
            ctx.fill(value.vertex.path2d(this.layout, value.kind == Building.CITY))

            //Cleanup
            ctx.fillStyle = "black"
        }
    }
    //TBD
}