import type {Layout} from "./Layout.ts";
import {CitySVGString, HouseSVGString} from "@/assets/assets.tsx";
import {Hex} from "@/game/hexagon/Hex.ts";
import {Edge} from "@/game/hexagon/Edge.ts";

export class Vertex {
    public q:number;
    public r:number;
    public s:number;
    public direction: string;
    public static EAST_DIRECTION: string = "EAST";
    public static WEST_DIRECTION: string = "WEST";

    constructor(q: number, r: number, s:number, direction: string) {
        this.q = q;
        this.r = r;
        this.s = s;
        this.direction = direction;
    }

    public toKey() {
        return `q${this.q}r${this.r}s${this.s}d${this.direction}`;
    }

    public static fromKey(key: string) {
        const matches = key.matchAll(/q(-?\d+)r(-?\d+)s(-?\d+)d(WEST|EAST)/gm);
        if (matches) {
            //Don't know how to not loop.
            for (const match of matches) {
                return new Vertex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), match[4]);
            }
        }
    }

    //TODO update this
    public path2d(layout: Layout, isCity: boolean): Path2D {
        const point = layout.vertexToPixelVertex(this);
        const circle = new Path2D();
        circle.arc(point.x, point.y, isCity ? layout.city_radius : layout.settlement_radius, 0, Math.PI * 2);
        return circle
    }

    public drawBuilding(canvas: HTMLCanvasElement, layout: Layout, isCity: boolean, playerColor: string) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Unable to draw building context.");
            return;
        }

        const point = layout.vertexToPixelVertex(this);
        const buildingHeight = 30;
        const buildingWidth = 30;

        const image = new Image();
        if (isCity) {
            image.src = CitySVGString(buildingWidth, buildingHeight, playerColor);
        } else {
            image.src = HouseSVGString(buildingWidth, buildingHeight, playerColor);
        }
        ctx.drawImage(image, point.x - buildingWidth/2, point.y - buildingHeight/2);
        console.log("Building should be drawn now");
    }

    public hexNeighbours() {
        const neighbours: Hex[] = [];
        if (this.direction == Vertex.WEST_DIRECTION) {
            neighbours[0] = new Hex(this.q - 1, this.r, this.s + 1);
            neighbours[1] = new Hex(this.q, this.r, this.s);
            neighbours[2] = new Hex(this.q, this.r+1, this.s -1);
        } else {
            neighbours[0] = new Hex(this.q+1, this.r-1, this.s);
            neighbours[1] = new Hex(this.q, this.r, this.s);
            neighbours[2] = new Hex(this.q+1, this.r, this.s-1);
        }
        return neighbours;
    }

    public edgeNeighbours() {
        const neighbours: Edge[] = [];
        if (this.direction == Vertex.WEST_DIRECTION) {
            neighbours[0] = new Edge(this.q, this.r, this.s, Edge.WEST_DIRECTION);
            neighbours[1] = new Edge(this.q-1, this.r+1, this.s, Edge.NORTH_DIRECTION);
            neighbours[2] = new Edge(this.q-1, this.r+1, this.s, Edge.EAST_DIRECTION);
        } else {
            neighbours[0] = new Edge(this.q,this.r,this.s, Edge.EAST_DIRECTION);
            neighbours[1] = new Edge(this.q+1, this.r, this.s-1, Edge.NORTH_DIRECTION);
            neighbours[2] = new Edge(this.q+1, this.r, this.s-1, Edge.WEST_DIRECTION);
        }
        return neighbours;
    }

    public vertexNeighbours() {
        const neighbours: Vertex[] = [];
        if (this.direction == Vertex.WEST_DIRECTION) {
            neighbours[0] = new Vertex(this.q-1,this.r,this.s+1, Vertex.EAST_DIRECTION);
            neighbours[1] = new Vertex(this.q-2,1+this.r,this.s+1, Vertex.EAST_DIRECTION);
            neighbours[2] = new Vertex(this.q-1,1+this.r,this.s, Vertex.EAST_DIRECTION);
        } else {
            neighbours[0] = new Vertex(this.q+1, this.r-1,this.s, Vertex.WEST_DIRECTION);
            neighbours[1] = new  Vertex(this.q+2, this.r-1,this.s-1, Vertex.WEST_DIRECTION);
            neighbours[2] = new Vertex(this.q+1, this.r,this.s-1, Vertex.WEST_DIRECTION);
        }
        return neighbours;
    }
}