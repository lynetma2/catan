import type {Layout} from "./Layout.ts";
import {CitySVGString, HouseSVGString} from "@/assets/assets.tsx";

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
}