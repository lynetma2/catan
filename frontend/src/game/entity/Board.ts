import type {Layout} from "../hexagon/Layout.ts";
import {Terrain} from "./Terrain.ts";
import type {Road} from "./Road.ts";
import {Building} from "./Building.ts";
import {Hex} from "@/game/hexagon/Hex.ts";

export class Board {
    public map: Map<string,Terrain>;
    public roads: Map<string,Road>;
    public buildings: Map<string,Building>;

    constructor(map: Map<string,Terrain>, roads: Map<string, Road>, buildings: Map<string, Building>) {
        this.map = map;
        this.roads = roads;
        this.buildings = buildings;
    }

    public static fromJSON(object: any): Board {
        const map = new Map<string,Terrain>();
        object.map.forEach((terrain: any) => {
            const t = new Terrain(new Hex(terrain.q, terrain.r, terrain.s), terrain.kind, terrain.dice, terrain.tradeKind);
            map.set(`q${terrain.q}r${terrain.r}s${terrain.s}`, t);
        });

        //TODO handle roads and buildings
        return new Board(map, new Map<string, Road>(), new Map<string, Building>);
    }

    public draw(canvas: HTMLCanvasElement, layout: Layout) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        //Should not clear the map
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Start by drawing the map.
        for (const [, value] of this.map) {
            value.draw(canvas, layout);
        }

        //Drawing roads.
        for (const [, value] of this.roads) {
            ctx.beginPath();
            ctx.strokeStyle = value.styling();
            ctx.lineWidth = layout.road_width;
            ctx.stroke(value.edge.path2d(layout));
            ctx.closePath();

            //Cleanup
            ctx.beginPath();
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1;
            ctx.stroke(value.edge.path2d(layout));
            ctx.closePath();
        }

        //Drawing buildings
        for (const [, value] of this.buildings) {
            //ctx.fillStyle = value.styling();
            //ctx.fill(value.vertex.path2d(layout, value.kind == Building.CITY));
            value.vertex.drawBuilding(canvas, layout, false, "green");

            //Cleanup
            ctx.fillStyle = "black"
        }




    }
    //TBD
}